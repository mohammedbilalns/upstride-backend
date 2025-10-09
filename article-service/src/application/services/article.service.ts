import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { Article } from "../../domain/entities/article.entity";
import type {
	IArticleReactionRepository,
	IArticleRepository,
	IArticleViewRepository,
	ITagRepository,
} from "../../domain/repositories";
import type { IArticleService } from "../../domain/services/article.service.interface";
import type {
	CreateArticleDto,
	FetchArticlesDto,
	FetchArticlesResponseDto,
	FetchRandomArticlesByAuthorsDto,
	UpdateArticleDto,
} from "../dtos/article.dto";
import { AppError } from "../errors/AppError";
import { generateDescription } from "../utils/generateDescription";
import Redis from "ioredis";

export class ArticleService implements IArticleService {

	constructor(
		private _articleRepository: IArticleRepository,
		private _tagRepository: ITagRepository,
		private _articleViewRepository: IArticleViewRepository,
		private _articleReactionRepository: IArticleReactionRepository,
		private _redisClient: Redis,

	) {}

	private readonly ARTICLE_CACHE_PREFIX = 'article:';
	private readonly ARTICLES_LIST_CACHE_PREFIX = 'articles:';
	private readonly CACHE_TTL = 3600; // 1 hour in seconds


	private async invalidateCache(pattern: string): Promise<void> {
		const keys = await this._redisClient.keys(pattern);
		if (keys.length > 0) {
			await this._redisClient.del(...keys);
		}
	}


	async createArticle(createAricleDto: CreateArticleDto): Promise<void> {
		const { content, tags, author,featuredImage,  ...rest } = createAricleDto;
		//		if(author.role !== "mentor") throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE,HttpStatus.FORBIDDEN)
		const tagIds = await this._tagRepository.createOrIncrement(tags);
		const description = generateDescription(content);
		await this._articleRepository.create({
			content,
			description,
			author,
			featuredImage: featuredImage?.secure_url, 
			...rest,
			tags: tagIds,
		});

		await this.invalidateCache(`${this.ARTICLES_LIST_CACHE_PREFIX}*`);

	}

	async getArticleById(
		id: string,
		userId: string,
	): Promise<{ article: Article; isViewed: boolean; isLiked: boolean }> {

		const cacheKey = `${this.ARTICLE_CACHE_PREFIX}${id}`;
		const cachedArticle = await this._redisClient.get(cacheKey);
		if (cachedArticle) {
			const article = JSON.parse(cachedArticle);

			const [isViewed, isLiked] = await Promise.all([
				this._articleViewRepository.findByArticleAndUser(id, userId),
				this._articleReactionRepository.findByArticleAndUser(id, userId),
			]);

			return { 
				article, 
				isViewed: !!isViewed, 
				isLiked: !!isLiked 
			};
		}
		const article = await this._articleRepository.findById(id);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		await Promise.all([
			this._articleViewRepository.create({ articleId: article.id, userId }),
			this._articleRepository.update(id, { views: article.views + 1 }),
		]);

		await this._redisClient.set(cacheKey, JSON.stringify(article), 'EX', this.CACHE_TTL);

		const isViewed = !!(await this._articleViewRepository.findByArticleAndUser(
			id,
			userId,
		));
		const isLiked =
			!!(await this._articleReactionRepository.findByArticleAndUser(
				id,
				userId,
			));

		return { article, isViewed, isLiked };
	}

	async fetchArticles(
		fetchArticlesDto: FetchArticlesDto,
	): Promise<FetchArticlesResponseDto> {
		const { page, sortBy, author, tag, query } =
			fetchArticlesDto;
		const limit = 4 

		const cacheKey = `${this.ARTICLES_LIST_CACHE_PREFIX}${JSON.stringify(fetchArticlesDto)}`;
		const cachedArticles = await this._redisClient.get(cacheKey);
		if (cachedArticles) {
			return JSON.parse(cachedArticles);
		}

		let repositoryResponse: { articles: Article[], total: number };

		if (author) {
			repositoryResponse = await this._articleRepository.findByAuthor(
				author, page, limit, sortBy, query,
			);
		}else if (tag) {
			repositoryResponse = await this._articleRepository.findByTag(
				tag, page, limit, sortBy, query,
			);
		} else {
			repositoryResponse = await this._articleRepository.find(query, page, limit, sortBy);
		}

		const articlesWithoutContent = repositoryResponse.articles.map(article => {
			const { content, ...articleWithoutContent } = article;
			return articleWithoutContent;
		});
		const result = {
			articles: articlesWithoutContent,
			total: repositoryResponse.total
		}
		await this._redisClient.set(cacheKey, JSON.stringify(result), 'EX', this.CACHE_TTL/2);

		return result 
	}

	async updateArticle(updateArticleData: UpdateArticleDto): Promise<void> {
		const { content, tags, userId, ...rest } = updateArticleData;
		const article = await this._articleRepository.findById(rest.id);
		if (article?.author !== userId) {
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		}
		if (tags) {
			const tagIds = await this._tagRepository.createOrIncrement(tags);
			await this._articleRepository.update(rest.id, { tags: tagIds });
		}
		if (content) {
			const description = generateDescription(content);
			await this._articleRepository.update(rest.id, { content, description });
		}
		await this._redisClient.del(`${this.ARTICLE_CACHE_PREFIX}${rest.id}`);

    const pattern = `${this.ARTICLES_LIST_CACHE_PREFIX}*`;
    const keys = await this._redisClient.keys(pattern);
    if (keys.length > 0) {
        await this._redisClient.del(...keys);
    }
	}
	async deleteArticle(id: string): Promise<void> {
		await this._articleRepository.delete(id);
	}

	async getRandomArticlesByAuthors(fetchArticlesDto: FetchRandomArticlesByAuthorsDto): Promise<FetchArticlesResponseDto> {
		const { authorIds, page, limit, sortBy, search } = fetchArticlesDto;
		const result = await this._articleRepository.findRandmoArticlesByAuthor(authorIds, page, limit, sortBy, search);
		return result
	}
}

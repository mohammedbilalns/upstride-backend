import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { Article } from "../../domain/entities/article.entity";
import type {
	IReactionRepository,
	IArticleRepository,
	IArticleViewRepository,
} from "../../domain/repositories";
import type { IArticleReadService } from "../../domain/services/article-read.service.interface";
import type {
	FetchArticlesDto,
	FetchArticlesResponseDto,
	FetchRandomArticlesByAuthorsDto,
} from "../dtos/article.dto";
import { ArticleCacheConstants } from "../utils/cacheUtils"; 
import { AppError } from "../errors/AppError";
import Redis from "ioredis";

export class ArticleReadService implements IArticleReadService {

	constructor(
		private _articleRepository: IArticleRepository,
		private _articleViewRepository: IArticleViewRepository,
		private _articleReactionRepository: IReactionRepository,
		private _redisClient: Redis,
	) {}

	private async updateViewCount(id: string, userId: string): Promise<void> {
		await Promise.all([
			this._articleViewRepository.create({ articleId: id, userId }),
			this._articleRepository.incrementViewCount(id),
		]);
	}

	async getArticleById(
		id: string,
		userId: string,
	): Promise<{ article: Omit<Article, "isActive" | "isArchived">; isViewed: boolean; isLiked: boolean }> {


		const contentCacheKey = `${ArticleCacheConstants.CONTENT_CACHE_PREFIX}${id}`
		let cachedContent = await this._redisClient.get(contentCacheKey)

		let article; 

		if(cachedContent){
			article = JSON.parse(cachedContent)
		}else{
			article = await this._articleRepository.findByArticleId(id)
			if(!article) throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
			await this._redisClient.set(contentCacheKey, JSON.stringify(article), 'EX', ArticleCacheConstants.CACHE_TTL);
		}
		const metrics = await this._articleRepository.getArticleMetrics(id)
		if(!metrics) throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		const articleWithMetrics = {
			...article, 
			views: metrics.views, 
			comments: metrics.comments, 
			likes: metrics.likes
		}
		const { isActive, isArchived, ...articleForView } = articleWithMetrics;

		const [isViewed, isLiked] = await Promise.all([
			this._articleViewRepository.findByArticleAndUser(id, userId),
			this._articleReactionRepository.findByResourceAndUser(id, userId),
		]);
		if(!isViewed) await this.updateViewCount(id, userId);

		return { article:articleForView, isViewed: !!isViewed , isLiked : !!isLiked };

	}

	async fetchArticles(
		fetchArticlesDto: FetchArticlesDto,
	): Promise<FetchArticlesResponseDto> {
		const { page, sortBy, author, tag, query } =
			fetchArticlesDto;
		const limit = 4 

		const cacheKey = `${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}${JSON.stringify(fetchArticlesDto)}`;
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
		await this._redisClient.set(cacheKey, JSON.stringify(result), 'EX', ArticleCacheConstants.CACHE_TTL/2);

		return result 
	}

	async getRandomArticlesByAuthors(fetchArticlesDto: FetchRandomArticlesByAuthorsDto): Promise<FetchArticlesResponseDto> {
		const { authorIds, page, limit, sortBy, search } = fetchArticlesDto;
		if(!authorIds) return { articles: [], total: 0 }

		const cacheKey = `${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}${fetchArticlesDto}`;
		const cachedArticles = await this._redisClient.get(cacheKey);
		if (cachedArticles) {
			return JSON.parse(cachedArticles);
		}

		const data = await this._articleRepository.findRandmoArticlesByAuthor(authorIds, page, limit, sortBy, search);
		const articlesWithoutContent = data.articles.map(article => {
			const { content, ...articleWithoutContent } = article;
			return articleWithoutContent;
		});
		const result = {
			articles: articlesWithoutContent,
			total: data.total
		}
		await this._redisClient.set(cacheKey, JSON.stringify(result), 'EX', ArticleCacheConstants.CACHE_TTL/2);
		return result
	}
}

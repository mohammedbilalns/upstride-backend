import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { Article } from "../../domain/entities/article.entity";
import type {
	IArticleRepository,
	IArticleViewRepository,
	IReactionRepository,
} from "../../domain/repositories";
import type { IArticleReadService } from "../../domain/services/article-read.service.interface";
import type { ICacheService } from "../../domain/services/cache.service.interface";
import type {
	FetchArticlesDto,
	FetchArticlesResponseDto,
	FetchRandomArticlesByAuthorsDto,
} from "../dtos/article.dto";
import { AppError } from "../errors/AppError";
import { ArticleCacheConstants } from "../utils/cacheUtils";

export class ArticleReadService implements IArticleReadService {
	constructor(
		private _articleRepository: IArticleRepository,
		private _articleViewRepository: IArticleViewRepository,
		private _articleReactionRepository: IReactionRepository,
		private _cacheService: ICacheService,
	) {}

	private async updateViewCount(id: string, userId: string): Promise<void> {
		await Promise.all([
			this._articleViewRepository.create({ articleId: id, userId }),
			this._articleRepository.incrementViewCount(id),
		]);
	}

	private async getCachedOrFetch<T>(
		cacheKey: string,
		fetchFn: () => Promise<T>,
		ttl?: number,
	): Promise<T> {
		const cached = await this._cacheService.get<T>(cacheKey);
		if (cached) return cached;

		const data = await fetchFn();
		await this._cacheService.set(cacheKey, data, ttl);
		return data;
	}

	async getArticleById(
		id: string,
		userId: string,
	): Promise<{
		article: Omit<Article, "isActive" | "isArchived"> & {
			views: number;
			comments: number;
			likes: number;
		};
		isViewed: boolean;
		isLiked: boolean;
	}> {
		const contentCacheKey = `${ArticleCacheConstants.CONTENT_CACHE_PREFIX}${id}`;

		const article = await this.getCachedOrFetch<Article>(
			contentCacheKey,
			async () => {
				const a = await this._articleRepository.findByArticleId(id);
				if (!a)
					throw new AppError(
						ErrorMessage.ARTICLE_NOT_FOUND,
						HttpStatus.NOT_FOUND,
					);
				return a;
			},
			ArticleCacheConstants.CACHE_TTL,
		);

		const metrics = await this._articleRepository.getArticleMetrics(id);
		if (!metrics)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		const articleWithMetrics: Article & {
			views: number;
			comments: number;
			likes: number;
		} = {
			...article,
			views: metrics.views,
			comments: metrics.comments,
			likes: metrics.likes,
		};

		const {
			isActive: _,
			isArchived: __,
			...articleForView
		} = articleWithMetrics;

		const [isViewed, userReaction] = await Promise.all([
			this._articleViewRepository.findByArticleAndUser(id, userId),
			this._articleReactionRepository.findByResourceAndUser(id, userId),
		]);

		if (!isViewed) await this.updateViewCount(id, userId);

		return {
			article: articleForView,
			isViewed: !!isViewed,
			isLiked: userReaction?.reaction === "like",
		};
	}

	async fetchArticles(
		fetchDto: FetchArticlesDto,
	): Promise<FetchArticlesResponseDto> {
		const cacheKey = `${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}${JSON.stringify(fetchDto)}`;

		return this.getCachedOrFetch<FetchArticlesResponseDto>(
			cacheKey,
			async () => {
				const { page, sortBy, author, tag, query } = fetchDto;
				const limit = 4;

				let repositoryResponse;
				if (author)
					repositoryResponse = await this._articleRepository.findByAuthor(
						author,
						page,
						limit,
						sortBy,
						query,
					);
				else if (tag)
					repositoryResponse = await this._articleRepository.findByTag(
						tag,
						page,
						limit,
						sortBy,
						query,
					);
				else
					repositoryResponse = await this._articleRepository.find(
						query,
						page,
						limit,
						sortBy,
					);

				const articlesWithoutContent = repositoryResponse.articles.map(
					({ content, ...rest }) => rest,
				);

				return {
					articles: articlesWithoutContent,
					total: repositoryResponse.total,
				};
			},
			ArticleCacheConstants.CACHE_TTL / 2,
		);
	}

	async getRandomArticlesByAuthors(
		fetchDto: FetchRandomArticlesByAuthorsDto,
	): Promise<FetchArticlesResponseDto> {
		if (!fetchDto.authorIds) return { articles: [], total: 0 };

		const cacheKey = `${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}${JSON.stringify(fetchDto)}`;

		return this.getCachedOrFetch<FetchArticlesResponseDto>(
			cacheKey,
			async () => {
				const data = await this._articleRepository.findRandmoArticlesByAuthor(
					fetchDto?.authorIds!,
					fetchDto.page,
					fetchDto.limit,
					fetchDto.sortBy,
					fetchDto.search,
				);

				const articlesWithoutContent = data.articles.map(
					({ content, ...rest }) => rest,
				);

				return {
					articles: articlesWithoutContent,
					total: data.total,
				};
			},
			ArticleCacheConstants.CACHE_TTL / 2,
		);
	}
}

import type Redis from "ioredis";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import type {
	IArticleRepository,
	ITagRepository,
} from "../../domain/repositories";
import type { IArticleWriteService } from "../../domain/services";
import type { CreateArticleDto, UpdateArticleDto } from "../dtos/article.dto";
import { AppError } from "../errors/AppError";
import { ArticleCacheConstants } from "../utils/cacheUtils";
import { generateDescription } from "../utils/generateDescription";

export class ArticleWriteService implements IArticleWriteService {
	constructor(
		private _articleRepository: IArticleRepository,
		private _tagRepository: ITagRepository,
		private _redisClient: Redis,
	) {}

	// Invlaidate cache matching pattern
	private async invalidateCache(pattern: string): Promise<void> {
		const keys = await this._redisClient.keys(pattern);
		if (keys.length > 0) {
			await this._redisClient.del(...keys);
		}
	}

	async createArticle(createAricleDto: CreateArticleDto): Promise<void> {
		const { content, tags, author, authorRole, featuredImage, ...rest } =
			createAricleDto;
		// check if authorRole is mentor
		if (authorRole !== "mentor")
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		// create tags
		const tagIds = await this._tagRepository.createOrIncrement(tags);
		// generate description
		const description = generateDescription(content);
		await this._articleRepository.create({
			content,
			description,
			author,
			featuredImage: featuredImage?.secure_url,
			featuredImageId: featuredImage?.public_id,
			...rest,
			tags: tagIds,
		});

		await this.invalidateCache(
			`${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}*`,
		);
	}

	async updateArticle(updateArticleData: UpdateArticleDto): Promise<void> {
		const { id, content, tags, userId, featuredImage, ...rest } =
			updateArticleData;
		const article = await this._articleRepository.findById(id);
		if (article?.author !== userId) {
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		}
		if (tags) {
			const tagIds = await this._tagRepository.createOrIncrement(tags);
			await this._articleRepository.update(id, { tags: tagIds });
		}
		if (content) {
			const description = generateDescription(content);
			await this._articleRepository.update(id, {
				content,
				description,
				featuredImage: featuredImage?.secure_url,
				...rest,
			});
		}
		await this._redisClient.del(
			`${ArticleCacheConstants.ARTICLE_CACHE_PREFIX}${id}`,
		);

		const pattern = `${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}*`;
		const keys = await this._redisClient.keys(pattern);
		if (keys.length > 0) {
			await this._redisClient.del(...keys);
		}
	}

	async deleteArticle(articleId: string): Promise<void> {
		const cacheKey = `${ArticleCacheConstants.ARTICLE_CACHE_PREFIX}${articleId}`;

		await Promise.all([
			this._articleRepository.delete(articleId),
			this._redisClient.del(cacheKey),
			this._redisClient.del(
				`${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}*`,
			),
		]);
	}
}

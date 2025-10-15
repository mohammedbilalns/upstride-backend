import type Redis from "ioredis";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import type {
    IArticleCommentRepository,
	IArticleRepository,
	IArticleViewRepository,
	IReactionRepository,
	ITagRepository,
} from "../../domain/repositories";
import type { IArticleWriteService } from "../../domain/services";
import type { CreateArticleDto, UpdateArticleDto } from "../dtos/article.dto";
import { AppError } from "../errors/AppError";
import { ArticleCacheConstants } from "../utils/cacheUtils";
import { generateDescription } from "../utils/generateDescription";
import { Article } from "../../domain/entities/article.entity";
import { Tag } from "../../domain/entities/tag.entity";

export class ArticleWriteService implements IArticleWriteService {
	constructor(
		private _articleRepository: IArticleRepository,
		private _tagRepository: ITagRepository,
		private _articleViewRepository: IArticleViewRepository,
		private _commentRepository: IArticleCommentRepository,
		private _articleReactionRepository: IReactionRepository,
		private _redisClient: Redis,
	) {}

	private async invalidateListCache(pattern: string): Promise<void> {
		const keys = await this._redisClient.keys(pattern);
		if (keys.length > 0) {
			await this._redisClient.del(...keys);
		}
	}

	private async _clearArticleCache(articleId: string): Promise<void> {
		const contentKey = `${ArticleCacheConstants.CONTENT_CACHE_PREFIX}${articleId}`;
		const listPattern = `${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}*`;

		const keys = await this._redisClient.keys(listPattern);
		const keysToDelete = [contentKey, ...keys];

		if (keysToDelete.length > 0) {
			await this._redisClient.del(...keysToDelete);
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

		await this.invalidateListCache(
			`${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}*`,
		);
	}

	async updateArticle(updateArticleData: UpdateArticleDto): Promise<void> {
	const { id, content, tags, userId, featuredImage, ...rest } = updateArticleData;
    
    const article = await this._articleRepository.findByArticleId(id);
    if (article?.author !== userId) {
        throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
    }

		const updateData: Partial<Article> = { ...rest };

		if (content) {
			updateData.content = content;
			updateData.description = generateDescription(content);
			updateData.featuredImageId = featuredImage?.public_id;
			updateData.featuredImage = featuredImage?.secure_url;
		}

    if (tags) {
        const prevTagNames = article.tags
            .filter((tag): tag is Tag => typeof tag !== 'string')
            .map((tag) => tag.name);
        
        const tagsToAdd = tags.filter((tag) => !prevTagNames.includes(tag));
        const tagsToRemove = prevTagNames.filter((tag) => !tags.includes(tag));
        
        const [newTagIds] = await Promise.all([
            tagsToAdd.length ? this._tagRepository.createOrIncrement(tagsToAdd) : Promise.resolve([]),
            tagsToRemove.length ? this._tagRepository.deleteOrDecrement(tagsToRemove) : Promise.resolve(),
        ]);
        
			const remainingTagIds = article.tags
			.filter((tag): tag is Tag => typeof tag !== 'string' && tags.includes(tag.name))
			.map((tag:any) => tag._id); 
        
        updateData.tags = [...remainingTagIds, ...newTagIds];
    }

    await this._articleRepository.update(id, updateData);

    await this._clearArticleCache(id);	
	}


	async deleteArticle(articleId: string, userId: string): Promise<void> {

		const article = await this._articleRepository.findByArticleId(articleId);
		if (!article) {
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		if(article.author !== userId) {
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		}
		const tags = article.tags.filter((tag): tag is Tag => typeof tag !== 'string').map((tag) => tag.name);
		const comments = await this._commentRepository.fetchCommentsByArticle(articleId);

		await Promise.all([
			this._articleRepository.delete(articleId),
			this._tagRepository.deleteOrDecrement(tags),
			this._articleViewRepository.deleteByArticle(articleId),
			this._articleReactionRepository.deleteByComments(comments),
			this._commentRepository.deleteByArticle(articleId),
			this._articleReactionRepository.deleteByArticle(articleId),
			this._clearArticleCache(articleId),
		]);
	}
}

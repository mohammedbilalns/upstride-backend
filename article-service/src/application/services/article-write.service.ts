import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { Article } from "../../domain/entities/article.entity";
import type { PopulatedTag, Tag } from "../../domain/entities/tag.entity";
import type {
	IArticleCommentRepository,
	IArticleRepository,
	IArticleViewRepository,
	IReactionRepository,
	ITagRepository,
} from "../../domain/repositories";
import type { IArticleWriteService } from "../../domain/services";
import type { ICacheService } from "../../domain/services/cache.service.interface";
import type { CreateArticleDto, UpdateArticleDto } from "../dtos/article.dto";
import { AppError } from "../errors/AppError";
import { ArticleCacheConstants } from "../utils/cacheUtils";
import { generateDescription } from "../utils/generateDescription";

export class ArticleWriteService implements IArticleWriteService {
	constructor(
		private _articleRepository: IArticleRepository,
		private _tagRepository: ITagRepository,
		private _articleViewRepository: IArticleViewRepository,
		private _commentRepository: IArticleCommentRepository,
		private _articleReactionRepository: IReactionRepository,
		private _cacheService: ICacheService,
	) {}

	private async invalidateListCache(): Promise<void> {
		await this._cacheService.delByPattern(
			`${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}*`,
		);
	}

	private async _clearArticleCache(articleId: string): Promise<void> {
		const contentKey = `${ArticleCacheConstants.CONTENT_CACHE_PREFIX}${articleId}`;
		await this._cacheService.del(contentKey);
		await this.invalidateListCache();
	}

	async createArticle(createAricleDto: CreateArticleDto): Promise<void> {
		const { content, tags, author, authorRole, featuredImage, ...rest } =
			createAricleDto;
		const cachedAuthor: { profilePicture: string } | null = await this._cacheService.get(
			`user:${author}`,
		);
		const authorImage = cachedAuthor?.profilePicture;

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
			authorImage,
			featuredImage: featuredImage?.secure_url,
			featuredImageId: featuredImage?.public_id,
			...rest,
			tags: tagIds,
		});

		await this.invalidateListCache();
	}

	async updateArticle(updateArticleData: UpdateArticleDto): Promise<void> {
		const { id, content, tags, userId, featuredImage, ...rest } =
			updateArticleData;

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
			const isPopulatedTag = (
				tag: string | PopulatedTag,
			): tag is PopulatedTag => {
				return typeof tag === "object" && tag !== null && "name" in tag;
			};

			const prevTagNames = article.tags
				.filter((tag): tag is Tag => typeof tag !== "string")
				.map((tag) => tag.name);

			const tagsToAdd = tags.filter((tag) => !prevTagNames.includes(tag));
			const tagsToRemove = prevTagNames.filter((tag) => !tags.includes(tag));

			const [newTagIds] = await Promise.all([
				tagsToAdd.length
					? this._tagRepository.createOrIncrement(tagsToAdd)
					: Promise.resolve([]),
				tagsToRemove.length
					? this._tagRepository.deleteOrDecrement(tagsToRemove)
					: Promise.resolve(),
			]);

			const remainingTagIds = article.tags
				.filter(
					(tag): tag is PopulatedTag =>
						isPopulatedTag(tag) && tags.includes(tag.name),
				)
				.map((tag) => tag._id || tag.id);

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
		if (article.author !== userId) {
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		}
		const tags = article.tags
			.filter((tag): tag is Tag => typeof tag !== "string")
			.map((tag) => tag.name);
		const comments =
			await this._commentRepository.fetchCommentsByArticle(articleId);

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

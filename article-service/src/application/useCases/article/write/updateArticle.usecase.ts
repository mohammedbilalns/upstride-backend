import { ErrorMessage, HttpStatus } from "../../../../common/enums";
import { Article } from "../../../../domain/entities/article.entity";
import { PopulatedTag, Tag } from "../../../../domain/entities/tag.entity";
import {
	IArticleRepository,
	ITagRepository,
} from "../../../../domain/repositories";
import { IArticleCacheService } from "../../../../domain/services/article-cache.service.interface";
import { IUpdateArticleUC } from "../../../../domain/useCases/article/write/updateArticle.usecase.interface";
import { UpdateArticleDto } from "../../../dtos/article.dto";
import { AppError } from "../../../errors/AppError";
import { generateDescription } from "../../../utils/generateDescription";

export class UpdateArticleUC implements IUpdateArticleUC {
	constructor(
		private _articleRepository: IArticleRepository,
		private _tagRepository: ITagRepository,
		private _articleCacheService: IArticleCacheService,
	) {}

	async execute(articleUpdateData: UpdateArticleDto): Promise<void> {
		const article = await this._articleRepository.findByArticleId(
			articleUpdateData.id,
		);
		if (article?.author !== articleUpdateData.userId) {
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		}

		const updateData: Partial<Article> = { title: articleUpdateData.title };

		if (articleUpdateData.content) {
			updateData.content = articleUpdateData.content;
			updateData.description = generateDescription(articleUpdateData.content);
		}

		if (articleUpdateData.featuredImage) {
			updateData.featuredImageId = articleUpdateData.featuredImage.public_id;
			updateData.featuredImage = articleUpdateData.featuredImage.secure_url;
		} else if (articleUpdateData.featuredImage === null) {
			updateData.featuredImageId = null;
			updateData.featuredImage = null;
		}

		// NOTE: updated logic to handle type errors
		if (articleUpdateData.tags !== undefined) {
			const nextTagNames = articleUpdateData.tags; // string[]

			const prevTagNames = article.tags
				.filter((tag): tag is Tag | PopulatedTag => typeof tag !== "string")
				.map((tag) => tag.name);

			const tagsToAdd = nextTagNames.filter(
				(tag) => !prevTagNames.includes(tag),
			);

			const tagsToRemove = prevTagNames.filter(
				(tag) => !nextTagNames.includes(tag),
			);

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
						typeof tag === "object" &&
						tag !== null &&
						nextTagNames.includes(tag.name),
				)
				.map((tag) => tag._id ?? tag.id);

			updateData.tags = [...remainingTagIds, ...newTagIds];
		}

		await this._articleRepository.update(articleUpdateData.id, updateData);

		await this._articleCacheService.clearArticleCache(articleUpdateData.id);
	}
}

import { inject, injectable } from "inversify";
import type {
	IArticleRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import { UserNotFoundError } from "../../authentication/errors";
import type {
	UpdateArticleInput,
	UpdateArticleOutput,
} from "../dtos/article-input.dto";
import {
	ArticleNotFoundError,
	ArticleOwnershipError,
	MentorOnlyArticleActionError,
} from "../errors";
import { ArticleMapper } from "../mappers/article.mapper";
import { generatePreviewContent } from "../utils/preview-content";
import type { IUpdateArticleUseCase } from "./update-article.usecase.interface";

@injectable()
export class UpdateArticleUseCase implements IUpdateArticleUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: UpdateArticleInput): Promise<UpdateArticleOutput> {
		const user = await this._userRepository.findById(input.userId);
		if (!user) {
			throw new UserNotFoundError();
		}

		if (user.role !== "MENTOR") {
			throw new MentorOnlyArticleActionError("update");
		}

		const existing = await this._articleRepository.findById(input.articleId);
		if (!existing || !existing.isActive) {
			throw new ArticleNotFoundError();
		}

		if (existing.authorId !== input.userId) {
			throw new ArticleOwnershipError("update");
		}

		const featuredImageUrl =
			input.featuredImageUrl ?? existing.featuredImageUrl;

		const update: Partial<typeof existing> = {
			...(input.title !== undefined && { title: input.title }),
			...(input.description !== undefined && {
				description: input.description,
				previewContent: generatePreviewContent(input.description),
			}),
			...(input.featuredImageUrl !== undefined && { featuredImageUrl }),
			...(input.tags !== undefined && { tags: input.tags }),
			...(input.isArchived !== undefined && { isArchived: input.isArchived }),
		};

		const updated = await this._articleRepository.updateById(
			input.articleId,
			update,
		);

		if (!updated) {
			throw new ArticleNotFoundError();
		}

		const dto = ArticleMapper.toDto(updated);
		if (dto.featuredImageUrl && !dto.featuredImageUrl.startsWith("http")) {
			try {
				dto.featuredImageUrl = this._storageService.getPublicUrl(
					dto.featuredImageId,
				);
			} catch (err) {
				console.error("Failed to sign article featured image URL:", err);
			}
		}

		return { article: dto };
	}
}

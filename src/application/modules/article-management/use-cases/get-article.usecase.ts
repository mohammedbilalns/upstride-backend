import { inject, injectable } from "inversify";
import type { IArticleRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import type {
	GetArticleInput,
	GetArticleOutput,
} from "../dtos/article-input.dto";
import { ArticleNotFoundError } from "../errors";
import { ArticleMapper } from "../mappers/article.mapper";
import type { IGetArticleUseCase } from "./get-article.usecase.interface";
import type { IMarkArticleViewUseCase } from "./mark-article-view.usecase.interface";

@injectable()
export class GetArticleUseCase implements IGetArticleUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.UseCases.MarkArticleView)
		private readonly _markArticleViewUseCase: IMarkArticleViewUseCase,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetArticleInput): Promise<GetArticleOutput> {
		const article = await this._articleRepository.findBySlug(input.slug);
		if (!article || !article.isActive) {
			throw new ArticleNotFoundError();
		}

		if (input.viewerUserId) {
			await this._markArticleViewUseCase.execute({
				articleId: article.id,
				viewerUserId: input.viewerUserId,
			});
		}

		const dto = ArticleMapper.toDto(article);
		if (dto.featuredImageUrl && !dto.featuredImageUrl.startsWith("http")) {
			try {
				dto.featuredImageUrl = await this._storageService.getSignedUrl(
					dto.featuredImageId,
				);
			} catch (err) {
				console.error("Failed to sign article featured image URL:", err);
			}
		}

		return {
			article: dto,
			isAuthor: input.viewerUserId === article.authorId,
		};
	}
}

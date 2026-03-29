import { inject, injectable } from "inversify";
import type {
	IArticleReactionRepository,
	IArticleRepository,
	IReportRepository,
} from "../../../../domain/repositories";
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
		@inject(TYPES.Repositories.ArticleReactionRepository)
		private readonly _reactionRepository: IArticleReactionRepository,
		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
		@inject(TYPES.UseCases.MarkArticleView)
		private readonly _markArticleViewUseCase: IMarkArticleViewUseCase,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetArticleInput): Promise<GetArticleOutput> {
		const article = await this._articleRepository.findBySlug(input.slug);

		const isAdmin = !!input.isAdminView;
		const isAuthor = article?.authorId === input.viewerUserId;

		if (!article || (!article.isActive && !isAdmin && !isAuthor)) {
			throw new ArticleNotFoundError();
		}

		if (article.authorSnapshot.isBlocked && !isAdmin && !isAuthor) {
			throw new ArticleNotFoundError();
		}

		let userReaction: any;
		let isReported = false;

		if (input.viewerUserId) {
			const [reactions, activeReports] = await Promise.all([
				this._reactionRepository.query({
					query: { resourceId: article.id, userId: input.viewerUserId },
				}),
				this._reportRepository.query({
					query: {
						targetId: article.id,
						reporterId: input.viewerUserId,
						status: "PENDING",
					},
				}),
				this._markArticleViewUseCase.execute({
					articleId: article.id,
					viewerUserId: input.viewerUserId,
				}),
			]);
			if (reactions.length > 0) {
				userReaction = reactions[0].reactionType;
			}
			isReported = activeReports.length > 0;
		}

		const dto = ArticleMapper.toDto(article);
		if (dto.featuredImageUrl && !dto.featuredImageUrl.startsWith("http")) {
			try {
				dto.featuredImageUrl = this._storageService.getPublicUrl(
					dto.featuredImageId,
				);
			} catch (err) {
				console.error("Failed to sign article featured image URL:", err);
			}
		}

		return {
			article: dto,
			isAuthor: input.viewerUserId === article.authorId,
			userReaction,
			isReported,
		};
	}
}

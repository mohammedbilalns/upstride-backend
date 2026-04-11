import { inject, injectable } from "inversify";
import { ArticleUnblockedEvent } from "../../../../domain/events/article-unblocked.event";
import type {
	IArticleRepository,
	IReportRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { EventBus } from "../../../events/event-bus.interface";
import { ArticleNotBlockedError, ArticleNotFoundError } from "../errors";
import { ArticleMapper } from "../mappers/article.mapper";
import type {
	IUnblockArticleUseCase,
	UnblockArticleInput,
	UnblockArticleOutput,
} from "./unblock-article.usecase.interface";

@injectable()
export class UnblockArticleUseCase implements IUnblockArticleUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
		@inject(TYPES.Services.EventBus)
		private readonly _eventBus: EventBus,
	) {}

	async execute(input: UnblockArticleInput): Promise<UnblockArticleOutput> {
		const article = await this._articleRepository.findById(input.articleId);
		if (!article) {
			throw new ArticleNotFoundError();
		}

		if (!article.isBlockedByAdmin) {
			throw new ArticleNotBlockedError(
				"This article is not blocked by an administrator.",
			);
		}

		const updated = await this._articleRepository.updateById(
			input.articleId,
			article.unblock(),
		);

		if (updated) {
			await this._eventBus.publish(
				new ArticleUnblockedEvent({
					articleId: updated.id,
					authorId: updated.authorId,
				}),
			);

			if (article.blockedByReportId) {
				await this._reportRepository.updateById(article.blockedByReportId, {
					isAppealSubmitted: false,
					actionTaken: "unblocked article",
					actionTakenAt: new Date(),
				});
			}
		}

		return {
			article: ArticleMapper.toDto(updated || article),
			isUnblocked: true,
		};
	}
}

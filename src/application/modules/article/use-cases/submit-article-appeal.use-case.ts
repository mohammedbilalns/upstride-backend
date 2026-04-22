import { inject, injectable } from "inversify";
import type {
	IArticleRepository,
	IReportRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import {
	ArticleNotBlockedError,
	ArticleNotFoundError,
	ArticleOwnershipError,
	BlockingReportNotFoundError,
} from "../errors";
import type {
	ISubmitArticleAppealUseCase,
	SubmitArticleAppealInput,
} from "./submit-article-appeal.use-case.interface";

@injectable()
export class SubmitArticleAppealUseCase implements ISubmitArticleAppealUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
	) {}

	async execute(input: SubmitArticleAppealInput): Promise<void> {
		const article = await this._articleRepository.findById(input.articleId);
		if (!article) {
			throw new ArticleNotFoundError();
		}

		if (article.authorId !== input.userId) {
			throw new ArticleOwnershipError("update");
		}

		if (!article.blockedByReportId) {
			throw new ArticleNotBlockedError(
				"No active blocking report found for this article to appeal.",
			);
		}

		const report = await this._reportRepository.findById(
			article.blockedByReportId,
		);
		if (!report) {
			throw new BlockingReportNotFoundError();
		}

		await this._reportRepository.updateById(report.id, {
			appealMessage: input.message,
			appealedAt: new Date(),
			isAppealSubmitted: true,
		});
	}
}

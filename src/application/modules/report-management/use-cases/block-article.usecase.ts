import { inject, injectable } from "inversify";
import { ArticleBlockedEvent } from "../../../../domain/events/article-blocked.event";
import type {
	IArticleRepository,
	IReportRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IEventBus } from "../../../events/app-event-bus.interface";
import { ArticleNotFoundError } from "../../article-management/errors";
import { ArticleMapper } from "../../article-management/mappers/article.mapper";
import { UserNotFoundError } from "../../authentication/errors";
import type { BlockArticleInput, BlockArticleOutput } from "../dtos/report.dto";
import { AdminOnlyReportActionError } from "../errors";
import type { IBlockArticleUseCase } from "./block-article.usecase.interface";

@injectable()
export class BlockArticleUseCase implements IBlockArticleUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
		@inject(TYPES.Services.AppEventBus)
		private readonly _eventBus: IEventBus,
	) {}

	async execute(input: BlockArticleInput): Promise<BlockArticleOutput> {
		const admin = await this._userRepository.findById(input.adminId);
		if (!admin) {
			throw new UserNotFoundError();
		}

		if (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN") {
			throw new AdminOnlyReportActionError("block articles");
		}

		const article = await this._articleRepository.findById(input.articleId);
		if (!article) {
			throw new ArticleNotFoundError();
		}

		const blockPayload = article.block(input.reason, input.reportId || null);

		const updated = await this._articleRepository.updateById(
			input.articleId,
			blockPayload,
		);

		if (!updated) {
			throw new ArticleNotFoundError();
		}

		await this._eventBus.publish(
			new ArticleBlockedEvent({
				articleId: updated.id,
				authorId: updated.authorId,
				reason: input.reason,
			}),
			{ durable: true },
		);

		if (input.reportId) {
			await this._reportRepository.updateById(input.reportId, {
				status: "RESOLVED",
				actionTaken: `Blocked article: ${input.reason}`,
				actionTakenAt: new Date(),
			});
		}

		return { article: ArticleMapper.toDto(updated) };
	}
}

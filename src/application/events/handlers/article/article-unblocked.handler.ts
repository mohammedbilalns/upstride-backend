import { inject, injectable } from "inversify";
import type { ArticleUnblockedEvent } from "../../../../domain/events/article-unblocked.event";
import { TYPES } from "../../../../shared/types/types";
import type { ICreateNotificationUseCase } from "../../../modules/notifications/use-cases/create-notification.use-case.interface";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class ArticleUnblockedHandler
	implements EventHandler<ArticleUnblockedEvent>
{
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: ArticleUnblockedEvent): Promise<void> {
		await this._createNotificationUseCase.execute({
			userId: event.payload.authorId,
			type: "ARTICLE",
			event: "ARTICLE_UNBLOCKED",
			title: "Article Unblocked",
			description: "Your article has been unblocked by an administrator.",
			metadata: {
				articleId: event.payload.articleId,
			},
		});
	}
}

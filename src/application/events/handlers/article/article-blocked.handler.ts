import { inject, injectable } from "inversify";
import type { ArticleBlockedEvent } from "../../../../domain/events/article-blocked.event";
import { TYPES } from "../../../../shared/types/types";
import type { ICreateNotificationUseCase } from "../../../modules/notifications/use-cases/create-notification.use-case.interface";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class ArticleBlockedHandler
	implements EventHandler<ArticleBlockedEvent>
{
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: ArticleBlockedEvent): Promise<void> {
		await this._createNotificationUseCase.execute({
			userId: event.payload.authorId,
			type: "ARTICLE",
			event: "ARTICLE_BLOCKED",
			title: "Article Blocked",
			description: `Your article has been blocked by an administrator. Reason: ${event.payload.reason}`,
			metadata: {
				articleId: event.payload.articleId,
				reason: event.payload.reason,
			},
		});
	}
}

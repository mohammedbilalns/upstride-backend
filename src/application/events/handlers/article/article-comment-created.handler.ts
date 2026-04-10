import { inject, injectable } from "inversify";
import type { ArticleCommentCreatedEvent } from "../../../../domain/events/article-comment-created.event";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import { shouldNotify } from "../../../../shared/utilities/notification.utils";
import type { ICreateNotificationUseCase } from "../../../modules/notifications/use-cases/create-notification.usecase.interface";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class ArticleCommentCreatedHandler
	implements EventHandler<ArticleCommentCreatedEvent>
{
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: ArticleCommentCreatedEvent): Promise<void> {
		logger.info(
			`Handling ArticleCommentCreatedEvent for comment: ${event.payload.commentId}`,
		);

		if (
			event.payload.actorId === event.payload.articleAuthorId ||
			!shouldNotify(event.payload.count)
		) {
			return;
		}

		const description = `You have ${event.payload.count} ${
			event.payload.count === 1 ? "comment" : "comments"
		} on your article`;

		try {
			await this._createNotificationUseCase.execute({
				userId: event.payload.articleAuthorId,
				title: "New Comment",
				description,
				type: "ARTICLE",
				event: "ARTICLE_COMMENTED",
				actorId: event.payload.actorId,
				relatedEntityId: event.payload.articleId,
				metadata: {
					articleId: event.payload.articleId,
					articleSlug: event.payload.articleSlug,
					commentId: event.payload.commentId,
				},
			});
		} catch (error) {
			logger.error(
				`Failed to create notification for ArticleCommentCreatedEvent: ${error}`,
			);
		}
	}
}

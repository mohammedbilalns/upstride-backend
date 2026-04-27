import { inject, injectable } from "inversify";
import type { ArticleCommentReactionCreatedEvent } from "../../../../domain/events/article-comment-reaction-created.event";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import { shouldNotify } from "../../../../shared/utilities/notification.utils";
import type { ICreateNotificationUseCase } from "../../../modules/notification/use-cases/create-notification.use-case.interface";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class ArticleCommentReactionCreatedHandler
	implements EventHandler<ArticleCommentReactionCreatedEvent>
{
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: ArticleCommentReactionCreatedEvent): Promise<void> {
		logger.info(
			`Handling ArticleCommentReactionCreatedEvent for comment: ${event.payload.commentId}`,
		);

		if (
			event.payload.actorId === event.payload.articleAuthorId ||
			!shouldNotify(event.payload.count)
		) {
			return;
		}

		const action = event.payload.reactionType === "LIKE" ? "liked" : "disliked";
		const othersCount = event.payload.count - 1;
		const description =
			othersCount > 0
				? `${event.payload.actorName} and ${othersCount} ${
						othersCount === 1 ? "other" : "others"
					} ${action} your comment`
				: `${event.payload.actorName} ${action} your comment`;

		try {
			await this._createNotificationUseCase.execute({
				userId: event.payload.articleAuthorId,
				title: "New Comment Reaction",
				description,
				type: "ARTICLE",
				event: "COMMENT_REACTED",
				actorId: event.payload.actorId,
				relatedEntityId: event.payload.articleId,
				metadata: {
					articleId: event.payload.articleId,
					articleSlug: event.payload.articleSlug,
					commentId: event.payload.commentId,
					reactionType: event.payload.reactionType,
				},
			});
		} catch (error) {
			logger.error(
				`Failed to create notification for ArticleCommentReactionCreatedEvent: ${error}`,
			);
		}
	}
}

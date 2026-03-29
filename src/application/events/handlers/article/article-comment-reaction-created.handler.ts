import { inject, injectable } from "inversify";
import type { ArticleCommentReactionCreatedEvent } from "../../../../domain/events/article-comment-reaction-created.event";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import { shouldNotify } from "../../../../shared/utilities/notification.utils";
import type { ICreateNotificationUseCase } from "../../../modules/notifications/use-cases/create-notification.usecase.interface";

@injectable()
export class ArticleCommentReactionCreatedHandler {
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: ArticleCommentReactionCreatedEvent): Promise<void> {
		logger.info(
			`Handling ArticleCommentReactionCreatedEvent for comment: ${event.commentId}`,
		);

		if (event.actorId === event.articleAuthorId || !shouldNotify(event.count)) {
			return;
		}

		const action = event.reactionType === "LIKE" ? "liked" : "disliked";
		const othersCount = event.count - 1;
		const description =
			othersCount > 0
				? `${event.actorName} and ${othersCount} ${
						othersCount === 1 ? "other" : "others"
					} ${action} your comment`
				: `${event.actorName} ${action} your comment`;

		try {
			await this._createNotificationUseCase.execute({
				userId: event.articleAuthorId,
				title: "New Comment Reaction",
				description,
				type: "ARTICLE",
				event: "COMMENT_REACTED",
				actorId: event.actorId,
				relatedEntityId: event.articleId,
				metadata: {
					articleId: event.articleId,
					articleSlug: event.articleSlug,
					commentId: event.commentId,
					reactionType: event.reactionType,
				},
			});
		} catch (error) {
			logger.error(
				`Failed to create notification for ArticleCommentReactionCreatedEvent: ${error}`,
			);
		}
	}
}

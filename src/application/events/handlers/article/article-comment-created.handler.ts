import { inject, injectable } from "inversify";
import type { ArticleCommentCreatedEvent } from "../../../../domain/events/article-comment-created.event";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import { shouldNotify } from "../../../../shared/utils/notification.utils";
import type { ICreateNotificationUseCase } from "../../../modules/notifications/use-cases/create-notification.usecase.interface";

@injectable()
export class ArticleCommentCreatedHandler {
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: ArticleCommentCreatedEvent): Promise<void> {
		logger.info(
			`Handling ArticleCommentCreatedEvent for comment: ${event.commentId}`,
		);

		if (event.actorId === event.articleAuthorId || !shouldNotify(event.count)) {
			return;
		}

		const description = `You have ${event.count} ${
			event.count === 1 ? "comment" : "comments"
		} on your article`;

		try {
			await this._createNotificationUseCase.execute({
				userId: event.articleAuthorId,
				title: "New Comment",
				description,
				type: "ARTICLE",
				event: "ARTICLE_COMMENTED",
				actorId: event.actorId,
				relatedEntityId: event.articleId,
				metadata: {
					articleId: event.articleId,
					articleSlug: event.articleSlug,
					commentId: event.commentId,
				},
			});
		} catch (error) {
			logger.error(
				`Failed to create notification for ArticleCommentCreatedEvent: ${error}`,
			);
		}
	}
}

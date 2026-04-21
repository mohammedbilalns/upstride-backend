import { inject, injectable } from "inversify";
import type { ArticleReactionCreatedEvent } from "../../../../domain/events/article-reaction-created.event";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import { shouldNotify } from "../../../../shared/utilities/notification.utils";
import type { ICreateNotificationUseCase } from "../../../modules/notifications/use-cases/create-notification.use-case.interface";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class ArticleReactionCreatedHandler
	implements EventHandler<ArticleReactionCreatedEvent>
{
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: ArticleReactionCreatedEvent): Promise<void> {
		logger.info(
			`Handling ArticleReactionCreatedEvent for article: ${event.payload.articleId}`,
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
					} ${action} your article`
				: `${event.payload.actorName} ${action} your article`;

		try {
			await this._createNotificationUseCase.execute({
				userId: event.payload.articleAuthorId,
				title: "New Reaction",
				description,
				type: "ARTICLE",
				event: "ARTICLE_REACTED",
				actorId: event.payload.actorId,
				relatedEntityId: event.payload.articleId,
				metadata: {
					articleId: event.payload.articleId,
					articleSlug: event.payload.articleSlug,
					reactionType: event.payload.reactionType,
				},
			});
		} catch (error) {
			logger.error(
				`Failed to create notification for ArticleReactionCreatedEvent: ${error}`,
			);
		}
	}
}

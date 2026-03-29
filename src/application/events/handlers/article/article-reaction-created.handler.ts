import { inject, injectable } from "inversify";
import type { ArticleReactionCreatedEvent } from "../../../../domain/events/article-reaction-created.event";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import { shouldNotify } from "../../../../shared/utils/notification.utils";
import type { ICreateNotificationUseCase } from "../../../modules/notifications/use-cases/create-notification.usecase.interface";

@injectable()
export class ArticleReactionCreatedHandler {
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: ArticleReactionCreatedEvent): Promise<void> {
		logger.info(
			`Handling ArticleReactionCreatedEvent for article: ${event.articleId}`,
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
					} ${action} your article`
				: `${event.actorName} ${action} your article`;

		try {
			await this._createNotificationUseCase.execute({
				userId: event.articleAuthorId,
				title: "New Reaction",
				description,
				type: "ARTICLE",
				event: "ARTICLE_REACTED",
				actorId: event.actorId,
				relatedEntityId: event.articleId,
				metadata: {
					articleId: event.articleId,
					articleSlug: event.articleSlug,
					reactionType: event.reactionType,
				},
			});
		} catch (error) {
			logger.error(
				`Failed to create notification for ArticleReactionCreatedEvent: ${error}`,
			);
		}
	}
}

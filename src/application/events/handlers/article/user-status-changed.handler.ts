import { inject, injectable } from "inversify";
import type { UserStatusChangedEvent } from "../../../../domain/events/user-status-changed.event";
import type { IArticleRepository } from "../../../../domain/repositories/article.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class ArticleUserStatusChangedHandler
	implements EventHandler<UserStatusChangedEvent>
{
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
	) {}

	async handle(event: UserStatusChangedEvent): Promise<void> {
		await this._articleRepository.updateAuthorSnapshotByAuthorId(
			event.payload.userId,
			{
				isBlocked: event.payload.isBlocked,
			},
		);
	}
}

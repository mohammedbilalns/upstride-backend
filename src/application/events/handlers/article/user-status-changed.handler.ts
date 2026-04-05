import { injectable } from "inversify";
import type { UserStatusChangedEvent } from "../../../../domain/events/user-status-changed.event";
import type { IArticleRepository } from "../../../../domain/repositories/article.repository.interface";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class ArticleUserStatusChangedHandler
	implements EventHandler<UserStatusChangedEvent>
{
	constructor(private readonly _articleRepository: IArticleRepository) {}

	async handle(event: UserStatusChangedEvent): Promise<void> {
		await this._articleRepository.updateAuthorSnapshotByAuthorId(
			event.payload.userId,
			{
				isBlocked: event.payload.isBlocked,
			},
		);
	}
}

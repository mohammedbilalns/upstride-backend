import { inject, injectable } from "inversify";
import type { ProfileUpdatedEvent } from "../../../../domain/events/profile-updated.event";
import type { IArticleRepository } from "../../../../domain/repositories";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class ProfileUpdatedHandler
	implements EventHandler<ProfileUpdatedEvent>
{
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
	) {}

	async handle(event: ProfileUpdatedEvent): Promise<void> {
		if (
			event.payload.name === undefined &&
			event.payload.avatarUrl === undefined
		) {
			return;
		}

		try {
			await this._articleRepository.updateAuthorSnapshotByAuthorId(
				event.payload.userId,
				{
					...(event.payload.name !== undefined && {
						name: event.payload.name,
					}),
					...(event.payload.avatarUrl !== undefined && {
						avatarUrl: event.payload.avatarUrl,
					}),
				},
			);
		} catch (error) {
			logger.error(
				`Failed to update author snapshots for ProfileUpdatedEvent: ${error}`,
			);
		}
	}
}

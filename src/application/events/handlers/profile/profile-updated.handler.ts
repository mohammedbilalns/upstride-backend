import { inject, injectable } from "inversify";
import type { ProfileUpdatedEvent } from "../../../../domain/events/profile-updated.event";
import type { IArticleRepository } from "../../../../domain/repositories";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";

@injectable()
export class ProfileUpdatedHandler {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
	) {}

	async handle(event: ProfileUpdatedEvent): Promise<void> {
		logger.info(
			`Handling ProfileUpdatedEvent for articles by user: ${event.userId}`,
		);

		if (event.name === undefined && event.avatarUrl === undefined) {
			return;
		}

		try {
			await this._articleRepository.updateAuthorSnapshotByAuthorId(
				event.userId,
				{
					...(event.name !== undefined && { name: event.name }),
					...(event.avatarUrl !== undefined && {
						avatarUrl: event.avatarUrl,
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

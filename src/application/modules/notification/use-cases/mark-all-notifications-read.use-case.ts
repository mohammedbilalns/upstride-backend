import { inject, injectable } from "inversify";
import type { INotificationRepository } from "../../../../domain/repositories/notification.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	MarkAllNotificationsReadInput,
	MarkAllNotificationsReadOutput,
} from "../dtos/notification.dto";
import type { IMarkAllNotificationsReadUseCase } from "./mark-all-notifications-read.use-case.interface";

@injectable()
export class MarkAllNotificationsReadUseCase
	implements IMarkAllNotificationsReadUseCase
{
	constructor(
		@inject(TYPES.Repositories.NotificationRepository)
		private readonly _notificationRepository: INotificationRepository,
	) {}

	async execute(
		input: MarkAllNotificationsReadInput,
	): Promise<MarkAllNotificationsReadOutput> {
		const updatedCount = await this._notificationRepository.markAllAsRead(
			input.userId,
		);

		return { updatedCount };
	}
}

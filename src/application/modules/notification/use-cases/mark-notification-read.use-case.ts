import { inject, injectable } from "inversify";
import type { INotificationRepository } from "../../../../domain/repositories/notification.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	MarkNotificationReadInput,
	MarkNotificationReadOutput,
} from "../dtos/notification.dto";
import { NotificationNotFoundError } from "../errors";
import { NotificationMapper } from "../mappers/notification.mapper";
import type { IMarkNotificationReadUseCase } from "./mark-notification-read.use-case.interface";

@injectable()
export class MarkNotificationReadUseCase
	implements IMarkNotificationReadUseCase
{
	constructor(
		@inject(TYPES.Repositories.NotificationRepository)
		private readonly _notificationRepository: INotificationRepository,
	) {}

	async execute(
		input: MarkNotificationReadInput,
	): Promise<MarkNotificationReadOutput> {
		const notification = await this._notificationRepository.findById(
			input.notificationId,
		);

		if (!notification || notification.userId !== input.userId) {
			throw new NotificationNotFoundError();
		}

		if (!notification.isRead) {
			notification.markAsRead();
			await this._notificationRepository.updateById(notification.id, {
				isRead: notification.isRead,
				readAt: notification.readAt,
			});
		}

		return {
			notification: NotificationMapper.toDto(notification),
		};
	}
}

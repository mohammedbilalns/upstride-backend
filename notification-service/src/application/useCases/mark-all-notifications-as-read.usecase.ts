import { INotificationRepository } from "../../domain/repositories/notification.repository.interface";
import { IMarkAllNotificationsAsReadUC } from "../../domain/useCases/mark-all-notifications-as-read.usecase.interface";
import { MarkAllNotificationsAsReadDto } from "../dtos/notification.dto";

export class MarkAllNotificationsAsReadUC
	implements IMarkAllNotificationsAsReadUC
{
	constructor(private _notificationRepository: INotificationRepository) {}

	async execute(dto: MarkAllNotificationsAsReadDto): Promise<void> {
		await this._notificationRepository.updateMany(
			{ userId: dto.userId },
			{ isRead: true },
		);
	}
}

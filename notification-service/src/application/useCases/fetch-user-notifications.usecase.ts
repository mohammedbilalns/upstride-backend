import { INotificationRepository } from "../../domain/repositories/notification.repository.interface";
import { IFetchUserNotificationsUC } from "../../domain/useCases/fetch-user-notifications.usecase.interface";
import {
	FetchUserNotificationsDto,
	NotificationResponse,
} from "../dtos/notification.dto";

export class FetchUserNotificationsUC implements IFetchUserNotificationsUC {
	constructor(private _notificationRepository: INotificationRepository) {}

	async execute(dto: FetchUserNotificationsDto): Promise<NotificationResponse> {
		const { notifications, total, unreadCount } =
			await this._notificationRepository.findAll(
				dto.userId,
				Number(dto.page),
				Number(dto.limit),
			);
		return { notifications, total, unreadCount };
	}
}

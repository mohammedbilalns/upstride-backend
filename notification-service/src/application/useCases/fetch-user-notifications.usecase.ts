import { INotificationRepository } from "../../domain/repositories/notification.repository.interface";
import { IFetchUserNotificationsUC } from "../../domain/useCases/fetch-user-notifications.usecase.interface";
import {
	FetchUserNotificationsDto,
	NotificationResponse,
} from "../dtos/notification.dto";

export class FetchUserNotificationsUC implements IFetchUserNotificationsUC {
	constructor(private _notificationRepository: INotificationRepository) {}

	async execute(
		fetchCriteria: FetchUserNotificationsDto,
	): Promise<NotificationResponse> {
		const { notifications, total, unreadCount } =
			await this._notificationRepository.findAll(
				fetchCriteria.userId,
				Number(fetchCriteria.page),
				Number(fetchCriteria.limit),
				fetchCriteria.filter,
			);
		return { notifications, total, unreadCount };
	}
}

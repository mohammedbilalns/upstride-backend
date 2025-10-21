import type {
	NotificationDto,
	NotificationResponseDto,
} from "../../application/dtos/notification.dto";

export interface INotificationService {
	// specify proper types later
	saveNotification(notificationData: NotificationDto): Promise<void>;
	markNotificationAsRead(notificationId: string): Promise<void>;
	fetchUserNotifications(
		userId: string,
		page: number,
		limit: number,
	): Promise<NotificationResponseDto>;
	makrAllNotificationsAsRead(userId: string): Promise<void>;
}

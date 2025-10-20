import { NotificationResponseDto } from "../../application/dtos/notification.dto";

export interface INotificationService {

	// specify proper types later 
	saveNotification(data: any): Promise<void>;
	markNotificationAsRead(notificationId: string): Promise<void>
	fetchUserNotifications(userId: string, page: number, limit: number): Promise<NotificationResponseDto>
}

import type { NotificationPayloadTypes } from "../../common/enums/notificationPayloadTypes";
import type { Notification } from "../../domain/entities/notification.entity";

export interface SaveNotificationDto {
	userId: string;
	type: NotificationPayloadTypes;
	triggeredBy?: string;
	targetResource?: string;
	time?: string;
}

export interface MarkNotificationAsReadDto {
	notificationId: string;
}

export interface MarkAllNotificationsAsReadDto {
	userId: string;
}

export interface FetchUserNotificationsDto {
	userId: string;
	page: number;
	limit: number;
}

export interface NotificationResponse {
	notifications: Notification[];
	total: number;
	unreadCount: number;
}

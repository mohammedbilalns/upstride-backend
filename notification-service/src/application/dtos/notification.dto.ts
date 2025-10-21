import type { NotificationPayloadTypes } from "../../common/enums/notificationPayloadTypes";
import type { Notification } from "../../domain/entities/notification.entity";

export interface NotificationResponseDto {
	notifications: Notification[];
	total: number;
	unreadCount: number;
}

export interface NotificationDto {
	userId: string;
	type: NotificationPayloadTypes;
	triggeredBy?: string;
	targetResource?: string;
	time?: string;
}

export interface GenerateNotificationDto {
	type: NotificationPayloadTypes;
	triggeredBy?: string;
	targetResource?: string;
	time?: string;
}

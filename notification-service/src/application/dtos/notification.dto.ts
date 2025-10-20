import { Notification } from "../../domain/entities/notification.entity";
import { NotificationPayloadTypes } from "../../common/enums/notificationPayloadTypes";

export interface NotificationResponseDto {
	notifications: Notification[], 
	total: number
} 

export interface NotificationDto {
	userId: string;
	type: NotificationPayloadTypes, 
	triggeredBy?: string,
	targetResource?: string,
	time?: string,
}


export interface GenerateNotificationDto {
	type: NotificationPayloadTypes,
	triggeredBy?: string,
	targetResource?: string,
	time?: string,
}

import { NotificationPayloadTypes } from "../../common/enums/notificationPayloadTypes";
import { NotificationType } from "../../common/types/notification.type";

export interface GenerateNotificationDto {
	type: NotificationPayloadTypes;
	triggeredBy?: string;
	targetResource?: string;
	time?: string;
}

export interface NotificationData {
	title: string;
	content: string;
	link?: string;
	type: NotificationType;
}

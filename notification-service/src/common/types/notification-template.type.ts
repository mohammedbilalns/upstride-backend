import type { GenerateNotificationDto } from "../../application/dtos/notification.dto";
import type { NotificationType } from "./notification.type";

export type NotificationTemplate = {
	getTitle: (info: GenerateNotificationDto) => string;
	getContent: (info: GenerateNotificationDto) => string;
	getLink?: (info: GenerateNotificationDto) => string;
	type: NotificationType;
};

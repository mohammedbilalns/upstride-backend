import { NotificationType } from "./notification.type";
import { GenerateNotificationDto } from "../../application/dtos/notification.dto";

export type NotificationTemplate = {
	getTitle: (info: GenerateNotificationDto) => string;
	getContent: (info: GenerateNotificationDto) => string;
	getLink?: (info: GenerateNotificationDto) => string;
	type: NotificationType;
};


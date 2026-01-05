import {
	GenerateNotificationDto,
	NotificationData,
} from "../../application/dtos/notification-generator.dto";

export interface INotificationGenerator {
	generate(trigger: GenerateNotificationDto): NotificationData;
}

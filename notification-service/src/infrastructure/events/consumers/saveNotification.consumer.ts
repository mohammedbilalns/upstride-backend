import { QueueEvents } from "../../../common/enums/queueEvents";
import { INotificationService } from "../../../domain/services/notification.service.interface";
import eventBus from "../eventBus";
import { NotificationPayload, notificationValidationSchema } from "../validations/notification.validation";

export async function createSaveNotificationConsumer(notificationService: INotificationService) {
	await eventBus.subscribe<NotificationPayload>(
	QueueEvents.SEND_NOTIFICATION, 
		async(payload) => {
			try{
				const notificationData = notificationValidationSchema.parse(payload);
				await notificationService.saveNotification(notificationData);
			}catch(error){
				console.log("Error saving notification", error);
			}
		}
	);
}

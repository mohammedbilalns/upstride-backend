import { QueueEvents } from "../../../common/enums/queueEvents";
import { ISaveNotificationUC } from "../../../domain/useCases/save-notification.usecase.interface";
import eventBus from "../eventBus";
import {
	type NotificationPayload,
	notificationValidationSchema,
} from "../validations/notification.validation";

export async function createSaveNotificationConsumer(
	saveNotificationUC: ISaveNotificationUC,
) {
	await eventBus.subscribe<NotificationPayload>(
		QueueEvents.SEND_NOTIFICATION,
		async (payload) => {
			try {
				const notificationData = notificationValidationSchema.parse(payload);
				await saveNotificationUC.execute(notificationData);
			} catch (error) {
				console.log("Error saving notification", error);
			}
		},
	);
}

import { NotificationService } from "../../../application/services/notification.service";
import { NotificationRepository } from "../../database/repositories/notification.repository";
import { createSaveNotificationConsumer } from "../consumers/saveNotification.consumer";

export async function composeSaveNotificationConsumer() {
	const notificationRepository = new NotificationRepository();
	const notificationService = new NotificationService(notificationRepository);
	await createSaveNotificationConsumer(notificationService);
}

import { NotificationService } from "../../../application/services/notification.service";
import { NotificationRepository } from "../../database/repositories/notification.repository";
import { createSaveNotificationConsumer } from "../consumers/saveNotification.consumer";
import EventBus from "../eventBus";

export async function composeSaveNotificationConsumer() {
	const notificationRepository = new NotificationRepository();
	const eventBus = EventBus

	const notificationService = new NotificationService(notificationRepository,eventBus);

	await createSaveNotificationConsumer(notificationService);
}

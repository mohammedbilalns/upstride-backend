import { NotificationGeneratorService } from "../../../application/services/notification-generator.service";
import { SaveNotificationUC } from "../../../application/useCases/save-notification.usecase";
import { NotificationRepository } from "../../database/repositories/notification.repository";
import { createSaveNotificationConsumer } from "../consumers/saveNotification.consumer";
import EventBus from "../eventBus";

export async function composeSaveNotificationConsumer() {
	const notificationRepository = new NotificationRepository();
	const eventBus = EventBus;

	const notificationGeneratorService = new NotificationGeneratorService();

	const saveNotificationUC = new SaveNotificationUC(
		notificationRepository,
		notificationGeneratorService,
		eventBus,
	);

	await createSaveNotificationConsumer(saveNotificationUC);
}

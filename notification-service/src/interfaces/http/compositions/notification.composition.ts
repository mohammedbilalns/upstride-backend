import { NotificationService } from "../../../application/services/notification.service";
import { IEventBus } from "../../../domain/events/IEventBus";
import type { INotificationRepository } from "../../../domain/repositories/notification.repository.interface";
import { NotificationRepository } from "../../../infrastructure/database/repositories/notification.repository";
import EventBus from "../../../infrastructure/events/eventBus";
import { NotificationController } from "../controllers/notification.controller";

export function createNotificationController(): NotificationController {
	const notificationRepository: INotificationRepository =
		new NotificationRepository();
	const eventBus: IEventBus = EventBus;
	const notificationService = new NotificationService(
		notificationRepository,
		eventBus,
	);
	return new NotificationController(notificationService);
}

import { NotificationService } from "../../../application/services/notification.service";
import { INotificationRepository } from "../../../domain/repositories/notification.repository.interface"
import { NotificationRepository } from "../../../infrastructure/database/repositories/notification.repository";
import { NotificationController } from "../controllers/notification.controller";


export function createNotificationController(): NotificationController {

	const notificationRepository: INotificationRepository = new NotificationRepository();
	const notificationService = new NotificationService(notificationRepository);
	return new NotificationController(notificationService);
}

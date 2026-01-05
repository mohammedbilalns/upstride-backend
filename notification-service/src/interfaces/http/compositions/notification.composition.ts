import { FetchUserNotificationsUC } from "../../../application/useCases/fetch-user-notifications.usecase";
import { MarkAllNotificationsAsReadUC } from "../../../application/useCases/mark-all-notifications-as-read.usecase";
import { MarkNotificationAsReadUC } from "../../../application/useCases/mark-notification-as-read.usecase";
import type { INotificationRepository } from "../../../domain/repositories/notification.repository.interface";
import { NotificationRepository } from "../../../infrastructure/database/repositories/notification.repository";
import { NotificationController } from "../controllers/notification.controller";

export function createNotificationController(): NotificationController {
	// ─────────────────────────────────────────────
	// Repositories
	// ─────────────────────────────────────────────
	const notificationRepository: INotificationRepository =
		new NotificationRepository();
	// ─────────────────────────────────────────────
	// Use Cases
	// ─────────────────────────────────────────────
	const markNotificationAsReadUC = new MarkNotificationAsReadUC(
		notificationRepository,
	);
	const fetchUserNotificationsUC = new FetchUserNotificationsUC(
		notificationRepository,
	);
	const markAllNotificationsAsReadUC = new MarkAllNotificationsAsReadUC(
		notificationRepository,
	);

	// ─────────────────────────────────────────────
	// Controller
	// ─────────────────────────────────────────────

	return new NotificationController(
		markNotificationAsReadUC,
		fetchUserNotificationsUC,
		markAllNotificationsAsReadUC,
	);
}

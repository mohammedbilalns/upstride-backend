import { Router } from "express";
import { createNotificationController } from "../compositions/notification.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createNotificationRouter() {
	const router = Router();
	const notificationController = createNotificationController();

	router.use(authMiddleware());
	router.use(authorizeRoles("user", "mentor"));
	router.get("/", notificationController.fetchUserNotifications);
	router.post("/mark-all", notificationController.markAllNotificationsAsRead);
	router.post(
		"/:notificationId",
		notificationController.markNotificationAsRead,
	);

	return router;
}

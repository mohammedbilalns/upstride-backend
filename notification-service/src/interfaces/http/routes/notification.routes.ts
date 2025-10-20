import { Router } from "express";
import { createNotificationController } from "../compositions/notification.composition";


export function createNotificationRouter() {
	const router = Router()
	const notificationController = createNotificationController();

	//router.post("/notifications", notificationController.createNotification);
	router.get("/notifications", notificationController.fetchUserNotifications);
	router.put("/notifications/:notificationId", notificationController.markNotificationAsRead);

	return router
}

import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import { NotificationController } from "../controllers";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	NotificationIdParamSchema,
	NotificationsQuerySchema,
} from "../validators";

const router = Router();
const notificationController = container.get(NotificationController);

router.use(verifySession);
router.use(authorizeRoles(["USER", "MENTOR"]));

router.get(
	ROUTES.NOTIFICATIONS.ROOT,
	validate({ query: NotificationsQuerySchema }),
	notificationController.getNotifications,
);

router.patch(
	ROUTES.NOTIFICATIONS.MARK_READ,
	validate({ params: NotificationIdParamSchema }),
	notificationController.markRead,
);

router.patch(ROUTES.NOTIFICATIONS.READ_ALL, notificationController.markAllRead);

router.get(
	ROUTES.NOTIFICATIONS.UNREAD_COUNT,
	notificationController.getUnreadCount,
);

export { router as notificationRouter };

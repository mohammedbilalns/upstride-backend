import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { ROUTES } from "../constants";
import { NotificationController } from "../controllers";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	NotificationIdParamSchema,
	NotificationsQuerySchema,
	RegisterPushSubscriptionSchema,
} from "../validators";

const router = Router();
const notificationController = apiContainer.get(NotificationController);

router.use(verifySession);
router.use(authorizeRoles(["USER", "MENTOR"]));

router.get(
	ROUTES.NOTIFICATIONS.ROOT,
	validate({ query: NotificationsQuerySchema }),
	notificationController.getNotifications,
);

router.post(
	ROUTES.NOTIFICATIONS.REGISTER_PUSH,
	validate({ body: RegisterPushSubscriptionSchema }),
	notificationController.registerPushSubscription,
);

router.delete(
	ROUTES.NOTIFICATIONS.REGISTER_PUSH,
	validate({ body: RegisterPushSubscriptionSchema }),
	notificationController.unregisterPushSubscription,
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

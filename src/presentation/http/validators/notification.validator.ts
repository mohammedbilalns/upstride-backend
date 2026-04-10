import { z } from "zod";
import { objectIdSchema, pageSchema } from "../../../shared/validators";

export const NotificationsQuerySchema = z.object({
	page: pageSchema,
	status: z.enum(["read", "unread", "all"]).default("all"),
});

export const NotificationIdParamSchema = z.object({
	notificationId: objectIdSchema,
});

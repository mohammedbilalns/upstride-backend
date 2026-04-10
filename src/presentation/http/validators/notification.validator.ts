import { z } from "zod";
import {
	buildObjectIdParamSchema,
	pageSchema,
} from "../../../shared/validators";

export const NotificationsQuerySchema = z.object({
	page: pageSchema,
	status: z.enum(["read", "unread", "all"]).default("all"),
});

export type NotificationsQuery = z.infer<typeof NotificationsQuerySchema>;

export const NotificationIdParamSchema =
	buildObjectIdParamSchema("notificationId");

export type NotificationIdParam = z.infer<typeof NotificationIdParamSchema>;

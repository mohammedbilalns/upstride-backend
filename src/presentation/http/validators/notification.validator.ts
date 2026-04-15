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

export const RegisterPushSubscriptionSchema = z.object({
	endpoint: z.url(),
	keys: z.object({
		p256dh: z.string().min(1),
		auth: z.string().min(1),
	}),
	deviceType: z.string().optional(),
});

export type RegisterPushSubscriptionBody = z.infer<
	typeof RegisterPushSubscriptionSchema
>;

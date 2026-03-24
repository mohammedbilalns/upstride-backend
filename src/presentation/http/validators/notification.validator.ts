import { z } from "zod";
import { objectIdSchema, pageSchema } from "../../../shared/validators";

export const notificationsQuerySchema = z.object({
	page: pageSchema,
	status: z.enum(["read", "unread", "all"]).default("all"),
});

export const notificationIdParamSchema = z.object({
	notificationId: objectIdSchema,
});

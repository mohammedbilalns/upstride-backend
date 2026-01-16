import { z } from "zod";
import { NotificationPayloadTypes } from "../../../common/enums/notification-payload-types";

export const notificationValidationSchema = z.object({
	userId: z.string(),
	type: z.enum(NotificationPayloadTypes),
	triggeredBy: z.string().optional(),
	targetResource: z.string(),
	time: z.string().optional(),
	payload: z.any().optional(),
});

export type NotificationPayload = z.infer<typeof notificationValidationSchema>;

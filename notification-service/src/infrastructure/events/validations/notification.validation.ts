import {z} from "zod";
import { NotificationPayloadTypes } from "../../../common/enums/notificationPayloadTypes";

export const notificationValidationSchema = z.object({
	userId: z.string(),
	type: z.enum(NotificationPayloadTypes),
	triggeredBy: z.string().optional(),
	targetResource: z.enum(["REACT"]).optional(), 
	time: z.string().optional(),
});

export type NotificationPayload = z.infer<typeof notificationValidationSchema>;

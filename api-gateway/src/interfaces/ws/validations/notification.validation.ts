import z from "zod";

export const notificationValidationSchema = z.object({
	userId: z.string(),
	title: z.string(),
	content: z.string(),
	type: z.string(),
	link: z.string(),
});

export type NotificationPayload = z.infer<typeof notificationValidationSchema>;

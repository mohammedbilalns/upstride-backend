import z from "zod";

export const notificationValidationSchema = z.object({
	id: z.string(),
	userId: z.string(),
	title: z.string(),
	content: z.string(),
	type: z.string(),
	link: z.string(),
	createdAt: z.string(),
});

export type NotificationPayload = z.infer<typeof notificationValidationSchema>;

import z from "zod";

export const notificationValidationSchema = z.object({
	type: z.string(),
	title: z.string(),
	isRead: z.boolean(),
	link: z.string(),
});

export const fetchNotificationsValidationSchema = z.object({
	page: z.coerce.number().default(1),
	limit: z.coerce.number().default(10),
});

export const markNotificationAsReadValidationSchema = z.object({
	notificationId: z.string(),
});

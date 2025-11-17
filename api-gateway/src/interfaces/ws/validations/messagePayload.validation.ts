import z from "zod";

export const mediaSchema = z.object({
	url: z.url(),
	fileType: z.string().optional(),
	size: z.number().optional(),
	name: z.string(),
});

export const messagePayloadSchema = z.object({
	chatId: z.string(),
	senderId: z.string(),
	senderName: z.string(),
	receiverId: z.string(),
	messageId: z.string(),
	attachment: mediaSchema.optional(),
	message: z.string().optional(),
	type: z.string(),
	timestamp: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
});

export const clientMessageSchema = z.object({
	to: z.string(),
	message: z.string().min(1, "Message cannot be empty").optional(),
	media: mediaSchema.optional(),
	type: z.string(),
	replyTo: z.string().optional(),
});

export const messageStatusPayloadSchema = z.object({
	senderId: z.string(),
	recieverId: z.string(),
});

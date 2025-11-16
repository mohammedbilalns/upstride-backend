import { z } from "zod";

export const mediaSchema = z.object({
	url: z.url(),
  name: z.string(),
	fileType: z.string(),
	size: z.number(),
});

export const messageSchema = z.object({
	from: z.string().min(1, "Sender ID is required"),
	to: z.string().min(1, "Recipient ID is required"),
	message: z.string().min(1, "Message cannot be empty").optional(),
	media: mediaSchema.optional(),
  type: z.string(),
	replyTo: z.string().optional(),
});

export type MessagePayload = z.infer<typeof messageSchema>;

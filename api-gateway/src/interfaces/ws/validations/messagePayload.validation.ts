import z from "zod";


export const messagePayloadSchema = z.object({
  chatId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  receiverId: z.string(), 
  messageId: z.string(),
  message: z.string(),
  type: z.string(),
  timestamp: z.union([z.string(), z.date()]).transform((val) => new Date(val)), 
});

export const mediaSchema = z.object({
	url: z.url(),
	fileType: z.string().optional(),
	size: z.number().optional(),
});

export const clientMessageSchema = z.object({
	to: z.string().min(1, "Recipient ID is required"),
	message: z.string().min(1, "Message cannot be empty"),
	media: mediaSchema.optional(),
  type: z.string(),
	replyTo: z.string().optional(),
});


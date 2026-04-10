import { z } from "zod";
import { objectIdSchema, pageSchema } from "../../../shared/validators";

export const ChatQuerySchema = z.object({
	page: pageSchema,
	filter: z.enum(["read", "unread", "all"]).default("all"),
});

export const ChatMessagesQuerySchema = z.object({
	page: pageSchema,
});

export const OtherUserParamSchema = z.object({
	otherUserId: objectIdSchema,
});

export const ChatIdParamSchema = z.object({
	chatId: objectIdSchema,
});

export const SendMessageBodySchema = z
	.object({
		content: z.string().trim().min(1).optional(),
		mediaId: z.string().trim().min(1).optional(),
		messageType: z.enum(["TEXT", "IMAGE", "FILE"]).optional(),
		repliedTo: objectIdSchema.optional(),
	})
	.refine((data) => data.content || data.mediaId, {
		message: "Message content or media is required",
	});

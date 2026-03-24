import { z } from "zod";
import { objectIdSchema, pageSchema } from "../../../shared/validators";

export const chatQuerySchema = z.object({
	page: pageSchema,
	filter: z.enum(["read", "unread", "all"]).default("all"),
});

export const otherUserParamSchema = z.object({
	otherUserId: objectIdSchema,
});

export const chatIdParamSchema = z.object({
	chatId: objectIdSchema,
});

export const sendMessageBodySchema = z
	.object({
		content: z.string().trim().min(1).optional(),
		mediaId: z.string().trim().min(1).optional(),
		repliedTo: objectIdSchema.optional(),
	})
	.refine((data) => data.content || data.mediaId, {
		message: "Message content or media is required",
	});

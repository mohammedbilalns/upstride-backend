import { z } from "zod";

export const articleCommentSchema = z.object({
	articleId: z.string(),
	content: z
		.string()
		.min(5, "Content must be at least 5 characters")
		.max(1000, "Content must be less than 5000 characters"),
	parentCommentId: z.string().optional(),
});

export const articleCommentUpdateSchema = z.object({
	commentId: z.string(),
	content: z
		.string()
		.min(5, "Content must be at least 5 characters")
		.max(1000, "Content must be less than 5000 characters"),
});

export const fetchCommentsQuerySchema = z.object({
	articleId: z.string(),
	page: z.coerce.number().min(1).max(100).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	parentCommentId: z.string().optional(),
});

export const deleteCommentSchema = z.object({
	commentId: z.string(),
});

import { z } from "zod";
import { ArticleReactionTypeValues } from "../../../domain/entities/article-reaction.entity";
import { objectIdSchema, pageSchema } from "../../../shared/validators";

export const ArticleSlugParamSchema = z.object({
	slug: z.string().trim().min(1, "Slug is required"),
});
export type ArticleSlugParam = z.infer<typeof ArticleSlugParamSchema>;

export const ArticleIdParamSchema = z.object({
	articleId: objectIdSchema,
});
export type ArticleIdParam = z.infer<typeof ArticleIdParamSchema>;

export const CommentIdParamSchema = z.object({
	commentId: objectIdSchema,
});
export type CommentIdParam = z.infer<typeof CommentIdParamSchema>;

export const CreateArticleBodySchema = z.object({
	title: z
		.string()
		.trim()
		.min(20, "Title must be at least 20 characters")
		.max(200),
	description: z
		.string()
		.trim()
		.min(200, "Content must be at least 200 characters")
		.max(50000),
	featuredImageUrl: z.string().optional().or(z.literal("")),
	tags: z.array(z.string().trim().min(1)).max(6).optional(),
});
export type CreateArticleBody = z.infer<typeof CreateArticleBodySchema>;

export const UpdateArticleBodySchema = z.object({
	title: z
		.string()
		.trim()
		.min(20, "Title must be at least 20 characters")
		.max(200)
		.optional(),
	description: z
		.string()
		.trim()
		.min(200, "Content must be at least 200 characters")
		.max(50000)
		.optional(),
	featuredImageUrl: z.string().trim().optional().or(z.literal("")),
	tags: z.array(z.string().trim().min(1)).max(6).optional(),
	isArchived: z.boolean().optional(),
});
export type UpdateArticleBody = z.infer<typeof UpdateArticleBodySchema>;

export const ArticlesQuerySchema = z.object({
	page: pageSchema,
	search: z.string().trim().min(1).optional(),
	skill: z.string().trim().min(1).optional(),
	interest: z.string().trim().min(1).optional(),
	authorId: objectIdSchema.optional(),
	limit: z.coerce.number().int().min(1).max(50).optional(),
});
export type ArticlesQuery = z.infer<typeof ArticlesQuerySchema>;

export const MentorArticlesQuerySchema = z.object({
	page: pageSchema,
	search: z.string().trim().min(1).optional(),
});
export type MentorArticlesQuery = z.infer<typeof MentorArticlesQuerySchema>;

export const CreateCommentBodySchema = z.object({
	content: z
		.string()
		.trim()
		.min(2, "Content must be at least 2 characters")
		.max(500, "Content must be at most 500 characters"),
	parentId: objectIdSchema.optional().nullable(),
});
export type CreateCommentBody = z.infer<typeof CreateCommentBodySchema>;

export const UpdateCommentBodySchema = z.object({
	content: z
		.string()
		.trim()
		.min(2, "Content must be at least 2 characters")
		.max(500, "Content must be at most 500 characters"),
});
export type UpdateCommentBody = z.infer<typeof UpdateCommentBodySchema>;

export const CommentsQuerySchema = z.object({
	page: pageSchema,
	parentId: z.preprocess(
		(val) => (val === "null" || val === "" ? null : val),
		objectIdSchema.nullable().optional(),
	),
});
export type CommentsQuery = z.infer<typeof CommentsQuerySchema>;

export const ReactBodySchema = z.object({
	reactionType: z.enum(ArticleReactionTypeValues).optional().default("LIKE"),
});
export type ReactBody = z.infer<typeof ReactBodySchema>;

export const AppealArticleBodySchema = z.object({
	message: z
		.string()
		.trim()
		.min(10, "Appeal message must be at least 10 characters")
		.max(1000, "Appeal message must be at most 1000 characters"),
});

export type AppealArticleBody = z.infer<typeof AppealArticleBodySchema>;

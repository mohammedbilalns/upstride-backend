import { z } from "zod";
import { ArticleReactionTypeValues } from "../../../domain/entities/article-reaction.entity";
import { objectIdSchema, pageSchema } from "../../../shared/validators";

export const ArticleSlugParamSchema = z.object({
	slug: z.string().trim().min(1, "Slug is required"),
});

export const ArticleIdParamSchema = z.object({
	articleId: objectIdSchema,
});

export const CommentIdParamSchema = z.object({
	commentId: objectIdSchema,
});

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

export const ArticlesQuerySchema = z.object({
	page: pageSchema,
	search: z.string().trim().min(1).optional(),
	skill: z.string().trim().min(1).optional(),
	interest: z.string().trim().min(1).optional(),
});

export const MentorArticlesQuerySchema = z.object({
	page: pageSchema,
	search: z.string().trim().min(1).optional(),
});

export const CreateCommentBodySchema = z.object({
	content: z.string().trim().min(1, "Content is required").max(2000),
	parentId: objectIdSchema.optional().nullable(),
});

export const UpdateCommentBodySchema = z.object({
	content: z.string().trim().min(1, "Content is required").max(2000),
});

export const CommentsQuerySchema = z.object({
	page: pageSchema,
	parentId: objectIdSchema.optional().nullable(),
});

export const ReactBodySchema = z.object({
	reactionType: z.enum(ArticleReactionTypeValues).optional().default("LIKE"),
});

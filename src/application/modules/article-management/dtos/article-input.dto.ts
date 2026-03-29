import type { ArticleReactionType } from "../../../../domain/entities/article-reaction.entity";
import type { ArticleDto } from "./article.dto";
import type { ArticleCommentDto } from "./article-comment.dto";
import type { ArticleReactionDto } from "./article-reaction.dto";

export interface CreateArticleInput {
	userId: string;
	title: string;
	description: string;
	featuredImageUrl: string;
	tags?: string[];
}

export interface CreateArticleOutput {
	article: ArticleDto;
}

export interface UpdateArticleInput {
	userId: string;
	articleId: string;
	title?: string;
	description?: string;
	featuredImageUrl?: string;
	tags?: string[];
	isArchived?: boolean;
}

export interface UpdateArticleOutput {
	article: ArticleDto;
}

export interface DeleteArticleInput {
	userId: string;
	articleId: string;
}

export interface GetArticleInput {
	slug: string;
	viewerUserId?: string;
	isAdminView?: boolean;
}

export interface GetArticleOutput {
	article: ArticleDto;
	isAuthor?: boolean;
	userReaction?: ArticleReactionType;
	isReported?: boolean;
	appealMessage?: string | null;
	appealedAt?: string | null;
}

export interface GetArticlesInput {
	page: number;
	search?: string;
	skill?: string;
	interest?: string;
	category?: string;
	viewerUserId?: string;
	authorId?: string;
	isMentorView?: boolean;
	ids?: string[];
	limit?: number;
	isAdminView?: boolean;
}

export interface GetArticlesOutput {
	items: ArticleDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface MarkArticleViewInput {
	articleId: string;
	viewerUserId: string;
}

export interface CreateArticleCommentInput {
	userId: string;
	articleId: string;
	parentId?: string | null;
	content: string;
}

export interface CreateArticleCommentOutput {
	comment: ArticleCommentDto;
}

export interface UpdateArticleCommentInput {
	userId: string;
	commentId: string;
	content: string;
}

export interface UpdateArticleCommentOutput {
	comment: ArticleCommentDto;
}

export interface DeleteArticleCommentInput {
	userId: string;
	commentId: string;
}

export interface DeleteArticleCommentOutput {
	commentId: string;
}

export interface GetArticleCommentsInput {
	articleId: string;
	page: number;
	parentId?: string | null;
}

export interface GetArticleCommentsOutput {
	items: ArticleCommentDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface ReactToArticleInput {
	articleId: string;
	userId: string;
	reactionType: ArticleReactionType;
}

export interface ReactToArticleOutput {
	reaction: ArticleReactionDto;
}

export interface ReactToArticleCommentInput {
	commentId: string;
	userId: string;
	reactionType: ArticleReactionType;
}

export interface ReactToArticleCommentOutput {
	reaction: ArticleReactionDto;
}

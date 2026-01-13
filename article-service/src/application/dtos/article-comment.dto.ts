import type { ArticleComment } from "../../domain/entities/article-comment.entity";

export interface CreateCommentDto {
	articleId: string;
	userId: string;
	parentCommentId?: string;
	userName: string;
	userImage: string;
	content: string;
}

export interface UpdateCommentDto {
	commentId: string;
	userId: string;
	content: string;
}

export interface FetchCommentsDto {
	userId: string;
	articleId: string;
	parentCommentId?: string;
	page: number;
	limit: number;
}

export interface DeleteCommentDto {
	commentId: string;
	userId: string;
}

// resp

export interface fetchCommentsResponseDto {
	comments: (Partial<ArticleComment> & { isLiked: boolean })[];
	total: number;
}

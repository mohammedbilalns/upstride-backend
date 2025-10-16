import type { ArticleComment } from "../../domain/entities/articleComment.entity";

export interface ArticleCommentDto {
	articleId: string;
	userId: string;
	parentCommentId?: string;
	userName: string;
	userImage: string;
	content: string;
}

export interface ArticleCommentUpdateDto {
	commentId: string;
	userId: string;
	content: string;
}

export interface fetchCommentsDto {
	userId: string;
	articleId: string;
	parentCommentId?: string;
	page: number;
	limit: number;
}
export interface fetchCommentsResponseDto {
	comments: (Partial<ArticleComment> & { isLiked: boolean })[];
	total: number;
}

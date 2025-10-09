import type { ArticleComment } from "../../domain/entities/articleComment.entity";

export interface ArticleCommentDto {
	articleId: string;
	userId: string;
	parentId?: string;
	userName: string;
	userImage: string;
	content: string;
}

export interface ArticleCommentUpdateDto {
	id: string;
	userId: string;
	content: string;
}

export interface fetchCommentsDto {
	articleId: string;
	parentId?: string;
	page: number;
	limit: number;
}
export interface fetchCommentsResponseDto {
	comments: Partial<ArticleComment>[];
	total: number;
}

export interface ArticleCommentDto {
	id: string;
	articleId: string;
	parentId: string | null;
	userId: string;
	likesCount: number;
	repliesCount: number;
	content: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

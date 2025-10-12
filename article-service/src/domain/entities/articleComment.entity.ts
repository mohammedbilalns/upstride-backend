export interface ArticleComment {
	id: string;
	articleId: string;
	parentId: string;
	userId: string;
	userName: string;
	userImage: string;
	likes: number;
	replies: number;
	content: string;
	isActive: boolean;
	createdAt: Date;
}

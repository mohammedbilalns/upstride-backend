
export interface ArticleComment {
	id: string;
	articleId: string;
	parentId: string;
	userId: string;
	userName: string;
	userImage: string;
	content: string;
	isActive: boolean;
}


export interface ArticleReaction {
	id: string;
	articleId: string;
	userId: string;
	userName: string;
	userImage: string;
	reaction: "like" | "dislike";
	createdAt: Date;
}

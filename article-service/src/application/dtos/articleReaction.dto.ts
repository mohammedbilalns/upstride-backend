
export interface ArticleReactionDto {
	articleId: string,
	userId: string,
	reaction: "like"| "dislike",
}

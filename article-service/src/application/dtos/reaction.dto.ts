export interface ReactionDto {
	resourceId: string;
	resourceType: "article" | "comment";
	userId: string;
	reaction: "like" | "dislike";
}

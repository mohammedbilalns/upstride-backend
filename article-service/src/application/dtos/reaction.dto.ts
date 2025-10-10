export interface ReactionDto {
	resourceId: string;
	userId: string;
	reaction: "like" | "dislike";
}

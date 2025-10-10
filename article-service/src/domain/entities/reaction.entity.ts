export interface Reaction {
	id: string;
	resourceId: string;
	userId: string;
	userName: string;
	userImage: string;
	reaction: "like" | "dislike";
	createdAt: Date;
}

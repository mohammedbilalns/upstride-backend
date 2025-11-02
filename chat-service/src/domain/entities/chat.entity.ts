export interface Chat {
	id: string;
	userIds: string[];
	lastMessage?: string;
	isArchived?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

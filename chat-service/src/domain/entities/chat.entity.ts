export interface Chat {
	id: string;
	userIds: string[];
	lastMessage?: string;
	isArchived?: boolean;
	isStarted?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

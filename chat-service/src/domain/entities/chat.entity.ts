export interface Chat {
	id: string;
	userIds: string[];
	lastMessage?: string;
	isArchived?: boolean;
	isStarted?: boolean;
	unreadCount: Map<string, number>;
	createdAt: Date;
	updatedAt: Date;
}

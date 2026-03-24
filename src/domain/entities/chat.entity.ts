export class Chat {
	constructor(
		public readonly id: string,
		public readonly user1Id: string,
		public readonly user2Id: string,
		public readonly lastMessageId: string | null,
		public readonly unreadCount: Map<string, number>,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}
}

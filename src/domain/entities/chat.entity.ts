import type { UserRole } from "./user.entity";

export class Chat {
	constructor(
		public readonly id: string,
		public readonly user1Id: string,
		public readonly user2Id: string,
		public readonly lastMessageId: string | null,
		public unreadCount: Map<string, number>,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}

	/**
	 * chat is only allowed between a USER and a MENTOR .
	 */
	static canStartBetween(roleA: UserRole, roleB: UserRole): boolean {
		const allowed = (r: UserRole) => r === "USER" || r === "MENTOR";
		if (!allowed(roleA) || !allowed(roleB)) return false;
		if (roleA === "USER" && roleB === "USER") return false;
		return true;
	}

	/** Returns true when userId is one of the two chat participants. */
	hasParticipant(userId: string): boolean {
		return this.user1Id === userId || this.user2Id === userId;
	}

	/** Resets the unread counter for the given reader to zero. */
	markRead(userId: string): void {
		this.unreadCount.set(userId, 0);
	}

	/** Increments the unread counter for the receiver by one and resets sender's counter. */
	incrementUnreadFor(receiverId: string, senderId: string): void {
		this.unreadCount.set(
			receiverId,
			(this.unreadCount.get(receiverId) ?? 0) + 1,
		);
		this.unreadCount.set(senderId, 0);
	}
}

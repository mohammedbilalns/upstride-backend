export const NotificationTypeValues = [
	"CHAT",
	"ARTICLE",
	"SESSION",
	"PAYMENT",
	"REPORT",
	"SYSTEM",
] as const;

export type NotificationType = (typeof NotificationTypeValues)[number];

export const NotificationEventValues = [
	"MESSAGE_RECEIVED",
	"SESSION_BOOKED",
	"ARTICLE_LIKED",
	"PAYMENT_SUCCESS",
] as const;

export type NotificationEvent = (typeof NotificationEventValues)[number];

export class Notification {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly title: string,
		public readonly description: string,
		public readonly type: NotificationType,
		public readonly event: NotificationEvent,
		public readonly createdAt: Date,
		public isRead: boolean = false,
		public readAt?: Date,
		public readonly metadata?: Record<string, unknown>,
		public readonly deliveryStatus?: {
			inApp: boolean;
			push?: boolean;
			email?: boolean;
		},

		public readonly actorId?: string,
		public updatedAt?: Date,
	) {}

	markAsRead() {
		if (this.isRead) return;
		this.isRead = true;
		this.readAt = new Date();
	}
}

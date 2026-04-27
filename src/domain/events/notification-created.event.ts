import type {
	NotificationEvent,
	NotificationType,
} from "../entities/notification.entity";
import { DomainEvent } from "./domain-event";

export type NotificationPayload = {
	id: string;
	userId: string;
	title: string;
	description: string;
	type: NotificationType;
	event: NotificationEvent;
	isRead: boolean;
	readAt?: Date;
	metadata?: Record<string, unknown>;
	deliveryStatus?: {
		inApp: boolean;
		push?: boolean;
		email?: boolean;
	};
	actorId?: string;
	relatedEntityId?: string;
	createdAt: Date;
	updatedAt?: Date;
};

export class NotificationCreatedEvent extends DomainEvent {
	readonly eventName = "notification.created";

	constructor(
		public readonly payload: {
			userId: string;
			notification: NotificationPayload;
		},
	) {
		super();
	}
}

import type {
	NotificationEvent,
	NotificationType,
} from "../../../../domain/entities/notification.entity";

export interface NotificationDto {
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
}

export interface CreateNotificationInput {
	userId: string;
	title: string;
	description: string;
	type: NotificationType;
	event: NotificationEvent;
	metadata?: Record<string, unknown>;
	deliveryStatus?: {
		inApp: boolean;
		push?: boolean;
		email?: boolean;
	};
	actorId?: string;
	relatedEntityId?: string;
}

export interface CreateNotificationOutput {
	notification: NotificationDto;
}

export type NotificationReadFilter = "read" | "unread" | "all";

export interface GetNotificationsInput {
	userId: string;
	page?: number;
	status?: NotificationReadFilter;
}

export interface GetNotificationsOutput {
	notifications: NotificationDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface MarkNotificationReadInput {
	userId: string;
	notificationId: string;
}

export interface MarkNotificationReadOutput {
	notification: NotificationDto;
}

export interface MarkAllNotificationsReadInput {
	userId: string;
}

export interface MarkAllNotificationsReadOutput {
	updatedCount: number;
}

export interface GetUnreadNotificationCountInput {
	userId: string;
}

export interface GetUnreadNotificationCountOutput {
	count: number;
}

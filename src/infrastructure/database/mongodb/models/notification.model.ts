import { model, Schema, type Types } from "mongoose";
import {
	type NotificationEvent,
	NotificationEventValues,
	type NotificationType,
	NotificationTypeValues,
} from "../../../../domain/entities/notification.entity";

export interface NotificationDocument {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
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
	actorId?: Types.ObjectId;
	relatedEntityId?: string;
	createdAt: Date;
	updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		type: { type: String, enum: NotificationTypeValues, required: true },
		event: { type: String, enum: NotificationEventValues, required: true },
		isRead: { type: Boolean, default: false },
		readAt: { type: Date },
		metadata: { type: Schema.Types.Mixed },
		deliveryStatus: {
			inApp: { type: Boolean, default: true },
			push: { type: Boolean },
			email: { type: Boolean },
		},
		actorId: { type: Schema.Types.ObjectId, ref: "User" },
		relatedEntityId: { type: String },
	},
	{ timestamps: true },
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ actorId: 1 });

export const NotificationModel = model<NotificationDocument>(
	"Notification",
	notificationSchema,
);

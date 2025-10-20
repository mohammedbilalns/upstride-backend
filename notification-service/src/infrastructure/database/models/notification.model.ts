import { type Document, model, Schema } from "mongoose";
import type { Notification } from "../../../domain/entities/notification.entity";

export interface INotification extends Document, Omit<Notification, "id"> {}

export const NotificationSchema: Schema = new Schema<INotification>(
	{
		userId: { type: String, required: true },
		type: { type: String, enum: ["chat", "article", "session", "connection"] },
		title: { type: String, required: true },
		content: { type: String, required: true },
		isRead: { type: Boolean, default: false },
		link: { type: String },
	},
	{ timestamps: true },
);

export const NotificationModel = model<INotification>(
	"Notification",
	NotificationSchema,
);

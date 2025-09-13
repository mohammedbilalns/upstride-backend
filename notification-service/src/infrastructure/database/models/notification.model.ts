import { Document,model,Schema } from "mongoose";
import { Notification } from "../../../domain/entities/notification.entity";

export interface INotification extends Document, Omit<Notification, "id">{}

export const NotificationSchema: Schema  = new Schema<INotification>({
	userId: {type: String, required: true},
	type: {type: String, }



})

export const NotificationModel = model<INotification>("Notification", NotificationSchema)

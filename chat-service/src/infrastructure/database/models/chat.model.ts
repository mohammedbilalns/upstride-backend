import { Document, model, Schema } from "mongoose";
import { Chat } from "../../../domain/entities/chat.entity";

export interface IChat extends Document, Omit<Chat, "id"> {}

// NOTE : unread count ?
export const chatSchema: Schema = new Schema(
	{
		userIds: {
			type: [String],
			required: true,
		},
		lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
		isArchived: { type: Boolean, default: false },
		isStarted: { type: Boolean, default: false },
		unreadCount: { type: Map, of: Number, default: {} },
	},
	{
		timestamps: true,
	},
);

chatSchema.index({ userIds: 1 });

export const chatModel = model<IChat>("Chat", chatSchema);

import { model, Schema, type Types } from "mongoose";

export interface ChatDocument {
	_id: Types.ObjectId;
	user1Id: Types.ObjectId;
	user2Id: Types.ObjectId;
	lastMessageId?: Types.ObjectId | null;
	unreadCount: Map<string, number>;
	createdAt: Date;
	updatedAt: Date;
}

const chatSchema = new Schema<ChatDocument>(
	{
		user1Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		user2Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		lastMessageId: {
			type: Schema.Types.ObjectId,
			ref: "ChatMessage",
			default: null,
		},
		unreadCount: {
			type: Map,
			of: Number,
			default: {},
		},
	},
	{ timestamps: true },
);

chatSchema.index({ user1Id: 1, user2Id: 1 });

export const ChatModel = model<ChatDocument>("Chat", chatSchema);

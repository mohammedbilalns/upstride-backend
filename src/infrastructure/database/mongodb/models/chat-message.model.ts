import { model, Schema, type Types } from "mongoose";
import {
	MessageStatusValues,
	MessageTypeValues,
} from "../../../../domain/entities/chat-message.entity";

export interface ChatMessageDocument {
	_id: Types.ObjectId;
	chatId: Types.ObjectId;
	senderId: Types.ObjectId;
	messageType: (typeof MessageTypeValues)[number];
	content?: string | null;
	attachementId?: string | null;
	repliedTo?: Types.ObjectId | null;
	status: (typeof MessageStatusValues)[number];
	createdAt: Date;
	updatedAt: Date;
}

const chatMessageSchema = new Schema<ChatMessageDocument>(
	{
		chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
		senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		messageType: { type: String, enum: MessageTypeValues, required: true },
		content: { type: String, default: null },
		attachementId: { type: String, default: null },
		repliedTo: {
			type: Schema.Types.ObjectId,
			ref: "ChatMessage",
			default: null,
		},
		status: { type: String, enum: MessageStatusValues, default: "send" },
	},
	{ timestamps: true },
);

chatMessageSchema.index({ chatId: 1, createdAt: -1 });
chatMessageSchema.index({ senderId: 1, createdAt: -1 });

export const ChatMessageModel = model<ChatMessageDocument>(
	"ChatMessage",
	chatMessageSchema,
);

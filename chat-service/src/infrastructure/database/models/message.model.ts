import { Document, model, Schema } from "mongoose";
import { Message } from "../../../domain/entities/message.entity";

export interface IMessage extends Document, Omit<Message, "id"> {}

export const messageSchema: Schema = new Schema(
	{
		chatId: {
			type: Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
		senderId: { type: String, required: true },
		content: { type: String, required: true },
		type: { type: String, enum: ["TEXT", "IMAGE", "FILE"] },
		attachments: { type: Array },
		repliedTo: { type: String },
		status: { type: String, enum: ["send", "delivered", "read"] },
		createdAt: { type: Date, required: true },
		updatedAt: { type: Date, required: true },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
);

export const MessageModel = model<IMessage>("Message", messageSchema);

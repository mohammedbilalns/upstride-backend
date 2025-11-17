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
		content: { type: String },
		type: { type: String, enum: ["TEXT", "IMAGE", "FILE"] },
		attachment: {
			url: { type: String },
			name: { type: String },
			fileType: { type: String },
			size: { type: Number },
		},
		repliedTo: { type: Schema.Types.ObjectId, ref: "Message" },
		status: {
			type: String,
			enum: ["send", "read"],
			default: "send",
		},
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
);

export const MessageModel = model<IMessage>("Message", messageSchema);

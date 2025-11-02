import { Document, model, Schema } from "mongoose";
import { Chat } from "../../../domain/entities/chat.entity";

export interface IChat extends Document, Omit<Chat, "id"> {}

export const chatSchema: Schema = new Schema(
	{
		type: {
			type: String,
			enum: ["DIRECT", "GROUP"],
			default: "DIRECT",
		},
		name: { type: String },
		description: { type: String },
		lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
		avatar: { type: String },
		isArchived: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
);

export const chatModel = model<IChat>("Chat", chatSchema);

import { Document, model, Schema } from "mongoose";
import { ChatEvent } from "../../../domain/entities/chatEvent.entity";

export interface IChatEvent extends Document, Omit<ChatEvent, "id"> {}

export const chatEventSchema: Schema = new Schema(
	{
		chatId: {
			type: Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
		actorId: { type: String, required: true },
		eventType: {
			type: String,
			enum: ["CHAT_RENAMED", "MEMBER_ADDED", "MEMBER_REMOVED"],
		},
		metaData: { type: Object },
	},
	{
		timestamps: true,
	},
);

export const ChatEventModel = model<IChatEvent>("ChatEvent", chatEventSchema);

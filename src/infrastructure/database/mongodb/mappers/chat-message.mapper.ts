import { Types } from "mongoose";
import { Chatmessage } from "../../../../domain/entities/chat-message.entity";
import type { ChatMessageDocument } from "../models/chat-message.model";

export class ChatMessageMapper {
	static toDomain(doc: ChatMessageDocument): Chatmessage {
		return new Chatmessage(
			doc._id.toString(),
			doc.chatId.toString(),
			doc.senderId.toString(),
			doc.messageType,
			doc.content ?? null,
			doc.attachementId ?? null,
			doc.repliedTo?.toString() ?? null,
			doc.status,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: Chatmessage): Partial<ChatMessageDocument> {
		return {
			chatId: new Types.ObjectId(entity.chatId),
			senderId: new Types.ObjectId(entity.senderId),
			messageType: entity.messageType,
			content: entity.content,
			attachementId: entity.attachementId,
			repliedTo: entity.repliedTo ? new Types.ObjectId(entity.repliedTo) : null,
			status: entity.status,
		};
	}
}

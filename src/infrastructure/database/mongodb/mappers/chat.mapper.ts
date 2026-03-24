import { Types } from "mongoose";
import { Chat } from "../../../../domain/entities/chat.entity";
import type { ChatDocument } from "../models/chat.model";

const toMap = (value: ChatDocument["unreadCount"]): Map<string, number> => {
	if (value instanceof Map) return value;
	if (!value) return new Map();
	return new Map(Object.entries(value));
};

export class ChatMapper {
	static toDomain(doc: ChatDocument): Chat {
		return new Chat(
			doc._id.toString(),
			doc.user1Id.toString(),
			doc.user2Id.toString(),
			doc.lastMessageId?.toString() ?? null,
			toMap(doc.unreadCount),
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: Chat): Partial<ChatDocument> {
		return {
			user1Id: new Types.ObjectId(entity.user1Id),
			user2Id: new Types.ObjectId(entity.user2Id),
			lastMessageId: entity.lastMessageId
				? new Types.ObjectId(entity.lastMessageId)
				: null,
			unreadCount: new Map(entity.unreadCount),
		};
	}
}

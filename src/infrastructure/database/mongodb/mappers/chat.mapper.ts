import { Types } from "mongoose";
import { Chat } from "../../../../domain/entities/chat.entity";
import type { ChatDocument } from "../models/chat.model";
import { toIdString } from "../utils/id.util";

const toMap = (value: ChatDocument["unreadCount"]): Map<string, number> => {
	if (value instanceof Map) return value;
	if (!value) return new Map();
	return new Map(Object.entries(value));
};

export class ChatMapper {
	static toDomain(doc: ChatDocument): Chat {
		return new Chat(
			toIdString(doc._id),
			toIdString(doc.user1Id),
			toIdString(doc.user2Id),
			doc.lastMessageId ? toIdString(doc.lastMessageId) : null,
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

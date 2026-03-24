import type { Chat } from "../../../../domain/entities/chat.entity";
import type { ChatDto } from "../dtos/chat.dto";

export class ChatMapper {
	static toDto(entity: Chat): ChatDto {
		return {
			id: entity.id,
			user1Id: entity.user1Id,
			user2Id: entity.user2Id,
			lastMessageId: entity.lastMessageId,
			unreadCount: Object.fromEntries(entity.unreadCount),
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toDtos(entities: Chat[]): ChatDto[] {
		return entities.map((entity) => ChatMapper.toDto(entity));
	}
}

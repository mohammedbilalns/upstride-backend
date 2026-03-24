import type { Chat } from "../../../../domain/entities/chat.entity";
import type {
	ChatDto,
	ChatLastMessageDto,
	ChatUserDto,
} from "../dtos/chat.dto";

const buildUser = (
	userId: string,
	usersById?: Map<string, ChatUserDto>,
): ChatUserDto => {
	return (
		usersById?.get(userId) ?? {
			id: userId,
			name: "Unknown",
		}
	);
};

export class ChatMapper {
	static toDtoForUser(
		entity: Chat,
		currentUserId: string,
		usersById?: Map<string, ChatUserDto>,
		lastMessagesByChatId?: Record<string, ChatLastMessageDto>,
	): ChatDto {
		const isUser1 = entity.user1Id === currentUserId;
		const senderId = isUser1 ? entity.user1Id : entity.user2Id;
		const receiverId = isUser1 ? entity.user2Id : entity.user1Id;
		const lastMessage = lastMessagesByChatId?.[entity.id] ?? null;

		return {
			id: entity.id,
			senderId,
			receiverId,
			sender: buildUser(senderId, usersById),
			receiver: buildUser(receiverId, usersById),
			lastMessageId: entity.lastMessageId,
			lastMessage,
			unreadCount: Object.fromEntries(entity.unreadCount),
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toDtosForUser(
		entities: Chat[],
		currentUserId: string,
		usersById?: Map<string, ChatUserDto>,
		lastMessagesByChatId?: Record<string, ChatLastMessageDto>,
	): ChatDto[] {
		return entities.map((entity) =>
			ChatMapper.toDtoForUser(
				entity,
				currentUserId,
				usersById,
				lastMessagesByChatId,
			),
		);
	}
}

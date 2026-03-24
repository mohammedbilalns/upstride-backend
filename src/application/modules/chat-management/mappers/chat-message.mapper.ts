import type { Chatmessage } from "../../../../domain/entities/chat-message.entity";
import type { ChatMessageDto } from "../dtos/chat.dto";

export class ChatMessageMapper {
	static toDto(entity: Chatmessage): ChatMessageDto {
		return {
			id: entity.id,
			chatId: entity.chatId,
			senderId: entity.senderId,
			messageType: entity.messageType,
			content: entity.content,
			attachementId: entity.attachementId,
			repliedTo: entity.repliedTo,
			status: entity.status,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}

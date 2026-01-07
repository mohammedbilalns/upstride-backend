import { ErrorMessage, HttpStatus } from "../../common/enums";
import { QueueEvents } from "../../common/enums/queueEvents";
import type { IEventBus } from "../../domain/events/eventBus.interface";
import type {
	IChatRepository,
	IMessageRepository,
} from "../../domain/repositories";
import { IMarkChatMessagesAsReadUC } from "../../domain/useCases/markChatMessagesAsRead.uc.interface";
import { AppError } from "../errors/AppError";

export class MarkChatMessagesAsReadUC implements IMarkChatMessagesAsReadUC {
	constructor(
		private _chatRepository: IChatRepository,
		private _messageRepository: IMessageRepository,
		private _eventBus: IEventBus,
	) {}

	async execute(userId: string, senderId: string): Promise<void> {
		// Find the chat where userIds includes both userId and senderId

		const chat = await this._chatRepository.findByParticipants(
			userId,
			senderId,
		);

		if (!chat)
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);

		await Promise.all([
			this._chatRepository.update(chat.id, {
				unreadCount: { ...chat.unreadCount, [userId]: 0 },
			}),
			this._messageRepository.markAllMessagesAsRead(chat.id, userId, senderId), // userId is receiver
			this._eventBus.publish(QueueEvents.MARKED_CHAT_READ, {
				chatId: chat.id,
				senderId: senderId,
				recieverId: userId,
			}),
		]);
	}
}

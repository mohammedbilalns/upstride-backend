import { ErrorMessage, HttpStatus } from "../../common/enums";
import { QueueEvents } from "../../common/enums/queueEvents";
import type { IEventBus } from "../../domain/events/eventBus.interface";
import type {
	IChatRepository,
	IMessageRepository,
} from "../../domain/repositories";
import type { IMarkMessageAsReadUC } from "../../domain/useCases/markMessageAsRead.uc.interface";
import type { MarkMessageAsReadDto } from "../dtos/markMessageAsRead.dto";
import { AppError } from "../errors/AppError";

export class MarkMessageAsReadUC implements IMarkMessageAsReadUC {
	constructor(
		private _messageRepository: IMessageRepository,
		private _chatRepository: IChatRepository,
		private _eventBus: IEventBus,
	) {}

	async execute(dto: MarkMessageAsReadDto): Promise<void> {
		const { userId, messageId } = dto;
		const message = await this._messageRepository.findById(messageId);
		if (!message)
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);

		const chat = await this._chatRepository.findById(message.chatId);
		if (!chat)
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);

		if (!chat.userIds.includes(userId))
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		const senderId = chat.userIds.find((id) => id !== userId);
		if (!senderId)
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);

		await Promise.all([
			this._chatRepository.update(chat.id, {
				unreadCount: { ...chat.unreadCount, [userId]: 0 },
			}),
			this._messageRepository.markMessagesAsRead(messageId, chat.id, senderId),
			this._eventBus.publish(QueueEvents.MARKED_MESSAGE_READ, {
				senderId: senderId,
				recieverId: userId,
			}),
		]);
	}
}

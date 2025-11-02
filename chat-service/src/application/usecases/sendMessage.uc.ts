import { ISendMessageUC } from "../../domain/useCases/sendMessage.uc.interface";
import { IChatRepository, IMessageRepository } from "../../domain/repositories";
import { SendMessageInput } from "../dtos/sendMessage.dto";
import { Chat, Message } from "../../domain/entities";
import { IEventBus } from "../../domain/events/eventBus.interface";
import { QueueEvents } from "../../common/enums/queueEvents";

export class SendMessageUC implements ISendMessageUC {
	constructor(
		private _messageRepository: IMessageRepository,
		private _chatRepository: IChatRepository,
		private _eventBus: IEventBus,
	) {}

	async execute(messageData: SendMessageInput): Promise<void> {
		const { from, to, message, media, replyTo } = messageData;

		// find existing chat
		let chat = await this._chatRepository.getChatByUserIds([from, to]);

		// create new chat if not found
		if (!chat) {
			chat = await this._chatRepository.create({
				userIds: [from, to],
				isArchived: false,
			} as Chat);
		}

		// create new message
		const newMessage: Partial<Message> = {
			chatId: chat.id,
			senderId: from,
			content: message,
			type: media ? "FILE" : "TEXT",
			attachment: media,
			repliedTo: replyTo,
		};

		const savedMessage = await this._messageRepository.create(newMessage);

		await Promise.all([
			this._chatRepository.update(chat.id, {
				lastMessage: savedMessage.id,
				updatedAt: new Date(),
			}),
			// TODO : add proper message event data to send to the reciever
			this._eventBus.publish(QueueEvents.SAVED_MESSAGE, {}),
		]);
	}
}

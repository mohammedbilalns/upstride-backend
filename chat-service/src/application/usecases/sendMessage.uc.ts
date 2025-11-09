import { ISendMessageUC } from "../../domain/useCases/sendMessage.uc.interface";
import { IChatRepository, IMessageRepository } from "../../domain/repositories";
import { SendMessageInput } from "../dtos/sendMessage.dto";
import { Chat, Message } from "../../domain/entities";
import { IEventBus } from "../../domain/events/eventBus.interface";
import { QueueEvents } from "../../common/enums/queueEvents";
import { IUserService } from "../../domain/services/user.service.interface";
import { AppError } from "../errors/AppError";
import { ErrorMessage } from "../../common/enums";
import logger from "../../utils/logger";

export class SendMessageUC implements ISendMessageUC {
	constructor(
		private _messageRepository: IMessageRepository,
		private _chatRepository: IChatRepository,
		private _eventBus: IEventBus,
		private _userService: IUserService,
	) {}

	async execute(messageData: SendMessageInput): Promise<void> {
    const { from, to, message, media, replyTo } = messageData;

		//  fetch sender and chat info
		let [sender, chat] = await Promise.all([
			this._userService.getUserById(from),
			this._chatRepository.getChatByUserIds([from, to]),
		]);

		if (!sender) throw new AppError(ErrorMessage.FAILED_TO_FETCH_USERS);

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
    logger.debug(`saved Message : ${JSON.stringify(savedMessage)}`)

		// update chat & publish message, notification events
		await Promise.all([
			this._chatRepository.update(chat.id, {
				lastMessage: savedMessage.id,
				updatedAt: new Date(),
				isStarted: true,
			}),
			this._eventBus.publish(QueueEvents.SAVED_MESSAGE, {
				chatId: chat.id,
				senderId: from,
				senderName: sender.name,
				receiverId: to,
				message: message,
				messageId: savedMessage.id,
				timestamp: savedMessage.createdAt,
				type: savedMessage.type,
			}),
      this._eventBus.publish(QueueEvents.SEND_NOTIFICATION, {
        userId: to,
        type:"RECIEVED_MESSAGE",
        triggeredBy:sender.name,
        targetResource: sender.id
      })
		]);
	}
}

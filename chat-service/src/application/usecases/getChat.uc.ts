import { ErrorMessage, HttpStatus } from "../../common/enums";
import { Message } from "../../domain/entities/message.entity";
import { IChatRepository } from "../../domain/repositories/chat.repository.interface";
import { IMessageRepository } from "../../domain/repositories/message.repository.interface";
import { IParticipantRepository } from "../../domain/repositories/participant.repository.interface";
import { IGetChatUC } from "../../domain/useCases/getChat.uc.interface";
import { AppError } from "../errors/AppError";

export class GetChatUC implements IGetChatUC {
	constructor(
		private _chatRepository: IChatRepository,
		private _participantRepository: IParticipantRepository,
		private _messageRepository: IMessageRepository,
	) {}

	async execute(
		userIds: string[],
		page: number,
		limit: number,
	): Promise<Message[]> {
		const chatId = await this._participantRepository.getChatByUserIds(userIds);
		if (!chatId)
			throw new AppError(ErrorMessage.CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);

		const chat = await this._chatRepository.findById(chatId);
		if (!chat)
			throw new AppError(ErrorMessage.CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);

		const messages = this._messageRepository.getChatMessages(
			chatId,
			page,
			limit,
		);
		return messages;
	}
}

import { ErrorMessage, HttpStatus } from "../../common/enums";
import { IChatRepository } from "../../domain/repositories/chat.repository.interface";
import { IMessageRepository } from "../../domain/repositories/message.repository.interface";
import { IGetChatUC } from "../../domain/useCases/getChat.uc.interface";
import { getChatDto, getChatResult } from "../dtos/getChat.dto";
import { AppError } from "../errors/AppError";

export class GetChatUC implements IGetChatUC {
	constructor(
		private _chatRepository: IChatRepository,
		private _messageRepository: IMessageRepository,
	) {}

	async execute(dto: getChatDto): Promise<getChatResult> {
		const { userIds, page, limit } = dto;
		// fetch chat
		const chat = await this._chatRepository.getChatByUserIds(userIds);
		if (!chat)
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
		// TODO: retrieve user details from using rpc call

		const { messages, total } = await this._messageRepository.getChatMessages(
			chat.id,
			page,
			limit,
		);

		return { messages, total };
	}
}

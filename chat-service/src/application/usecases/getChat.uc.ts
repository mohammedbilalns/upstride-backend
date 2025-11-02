import { ErrorMessage, HttpStatus } from "../../common/enums";
import { IChatRepository } from "../../domain/repositories/chat.repository.interface";
import { IMessageRepository } from "../../domain/repositories/message.repository.interface";
import { IUserService } from "../../domain/services/user.service.interface";
import { IGetChatUC } from "../../domain/useCases/getChat.uc.interface";
import { getChatDto, getChatResult } from "../dtos/getChat.dto";
import { AppError } from "../errors/AppError";

export class GetChatUC implements IGetChatUC {
	constructor(
		private _chatRepository: IChatRepository,
		private _messageRepository: IMessageRepository,
		private _userService: IUserService,
	) {}

	async execute(dto: getChatDto): Promise<getChatResult> {
		const { userIds, page, limit } = dto;

		const chat = await this._chatRepository.getChatByUserIds(userIds);
		if (!chat) {
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
		}

		const [users, { messages, total }] = await Promise.all([
			// retrieve user details
			this._userService.getUsersByIds(userIds),
			// retrieve chat messages
			this._messageRepository.getChatMessages(chat.id, page, limit),
		]);

		if (!users || !users.length) {
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_USERS,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		// Map messages with sender details
		const mappedMessages = messages.map((msg) => {
			const sender = users.find((u) => u.id === msg.senderId);
			return {
				...msg,
				sender: sender
					? {
							id: sender.id,
							name: sender.name,
							profilePicture: sender.profilePicture,
						}
					: null,
			};
		});

		return {
			messages: mappedMessages,
			total,
		};
	}
}

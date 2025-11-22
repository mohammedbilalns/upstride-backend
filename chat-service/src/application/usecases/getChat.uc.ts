import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { Message } from "../../domain/entities";
import type { IChatRepository } from "../../domain/repositories/chat.repository.interface";
import type { IMessageRepository } from "../../domain/repositories/message.repository.interface";
import type { IUserService } from "../../domain/services/user.service.interface";
import type { IGetChatUC } from "../../domain/useCases/getChat.uc.interface";
import type { getChatDto, getChatResult } from "../dtos/getChat.dto";
import { AppError } from "../errors/AppError";

export class GetChatUC implements IGetChatUC {
	constructor(
		private _chatRepository: IChatRepository,
		private _messageRepository: IMessageRepository,
		private _userService: IUserService,
	) {}

	async execute(dto: getChatDto): Promise<getChatResult> {
		const { userIds, currentUserId, page, limit } = dto;

		// Get or create the chat
		let chat = await this._chatRepository.getChatByUserIds(userIds);
		let isNewChat = false;

		if (!chat) {
			chat = await this._chatRepository.create({ userIds });
			isNewChat = true;
		}

		// Get user details for all participants
		const users = await this._userService.getUsersByIds(userIds);

		if (!users || !users.length) {
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_USERS,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		// Determine the other participant
		const participant = users.find((u) => u.id !== currentUserId);

		if (!participant) {
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_USERS,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		// Only fetch messages if this is not a new chat
		let messages: Message[] = [];
		let total = 0;

		if (!isNewChat) {
			const result = await this._messageRepository.getChatMessages(
				chat.id,
				page,
				limit,
			);
			messages = result.messages;
			total = result.total;

			// Map messages with sender details
			messages = messages.map((msg) => {
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
		}

		return {
			chat: {
				id: chat.id,
				participant: {
					id: participant.id,
					name: participant.name,
					profilePicture: participant.profilePicture,
				},
			},
			messages,
			total,
		};
	}
}

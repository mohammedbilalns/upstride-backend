import { inject, injectable } from "inversify";
import { Chatmessage } from "../../../../domain/entities/chat-message.entity";
import type {
	IChatMessageRepository,
	IChatRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { SendMessageInput, SendMessageOutput } from "../dtos/chat.dto";
import {
	ChatAccessDeniedError,
	ChatNotFoundError,
	InvalidMessageError,
} from "../errors";
import { ChatMessageMapper } from "../mappers/chat-message.mapper";
import type { ISendMessageUseCase } from "./send-message.usecase.interface";

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
	constructor(
		@inject(TYPES.Repositories.ChatRepository)
		private readonly _chatRepository: IChatRepository,
		@inject(TYPES.Repositories.ChatMessageRepository)
		private readonly _chatMessageRepository: IChatMessageRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute(input: SendMessageInput): Promise<SendMessageOutput> {
		if (!input.content && !input.mediaId) {
			throw new InvalidMessageError();
		}

		const chat = await this._chatRepository.findById(input.chatId);
		if (!chat) {
			throw new ChatNotFoundError();
		}

		const isParticipant =
			chat.user1Id === input.senderId || chat.user2Id === input.senderId;

		if (!isParticipant) {
			throw new ChatAccessDeniedError("Sender is not part of this chat");
		}

		const receiverId =
			chat.user1Id === input.senderId ? chat.user2Id : chat.user1Id;

		const messageType = input.mediaId ? "FILE" : "TEXT";

		const message = new Chatmessage(
			this._idGenerator.generate(),
			input.chatId,
			input.senderId,
			messageType,
			input.content ?? null,
			input.mediaId ?? null,
			input.repliedTo ?? null,
			"send",
			new Date(),
			new Date(),
		);

		const created = await this._chatMessageRepository.create(message);

		const unreadCount = new Map(chat.unreadCount);
		unreadCount.set(receiverId, (unreadCount.get(receiverId) ?? 0) + 1);
		unreadCount.set(input.senderId, 0);

		await this._chatRepository.updateById(chat.id, {
			lastMessageId: created.id,
			unreadCount,
		});

		// TODO: Publish a "chat.message.sent" domain event for websocket sync.
		return { message: ChatMessageMapper.toDto(created) };
	}
}

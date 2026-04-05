import { inject, injectable } from "inversify";
import { Chatmessage } from "../../../../domain/entities/chat-message.entity";
import {
	type ChatMessagePayload,
	MessageSentEvent,
} from "../../../../domain/events/message-sent.event";
import type {
	IChatMessageRepository,
	IChatRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { RealtimeEventBus } from "../../../events/realtime-event-bus.interface";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { SendMessageInput, SendMessageOutput } from "../dtos/chat.dto";
import {
	ChatAccessDeniedError,
	ChatNotFoundError,
	InvalidMessageError,
} from "../errors";
import { ChatMessageMapper } from "../mappers/chat-message.mapper";
import type { ICreateChatUseCase } from "./create-chat.usecase.interface";
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
		@inject(TYPES.UseCases.CreateChat)
		private readonly _createChatUseCase: ICreateChatUseCase,
		@inject(TYPES.Services.RealtimeEventBus)
		private readonly _eventBus: RealtimeEventBus,
	) {}

	async execute(input: SendMessageInput): Promise<SendMessageOutput> {
		if (!input.content && !input.mediaId) {
			throw new InvalidMessageError();
		}

		let chat = await this._chatRepository.findById(input.chatId);
		if (!chat) {
			const existing = await this._chatRepository.findByParticipants(
				input.senderId,
				input.chatId,
			);
			if (existing) {
				chat = existing;
			} else {
				const created = await this._createChatUseCase.execute({
					userId: input.senderId,
					otherUserId: input.chatId,
				});
				chat = await this._chatRepository.findById(created.chat.id);
				if (!chat) {
					throw new ChatNotFoundError();
				}
			}
		}

		if (!chat.hasParticipant(input.senderId)) {
			throw new ChatAccessDeniedError("Sender is not part of this chat");
		}

		const receiverId =
			chat.user1Id === input.senderId ? chat.user2Id : chat.user1Id;

		const messageType = input.mediaId ? (input.messageType ?? "FILE") : "TEXT";

		const message = new Chatmessage(
			this._idGenerator.generate(),
			chat.id,
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

		chat.incrementUnreadFor(receiverId, input.senderId);

		await this._chatRepository.updateById(chat.id, {
			lastMessageId: created.id,
			unreadCount: chat.unreadCount,
		});

		const messageDto = ChatMessageMapper.toDto(created);
		const { users } = await this._chatRepository.findByParticipantsWithUsers(
			input.senderId,
			receiverId,
		);
		const usersById = new Map(users.map((user) => [user.id, user]));
		const senderName = usersById.get(input.senderId)?.name ?? "someone";
		const receiverName = usersById.get(receiverId)?.name ?? "someone";

		// Publish event
		const messagePayload: ChatMessagePayload = {
			id: messageDto.id,
			chatId: messageDto.chatId,
			senderId: messageDto.senderId,
			messageType: messageDto.messageType,
			content: messageDto.content,
			attachementId: messageDto.attachementId,
			mediaUrl: messageDto.mediaUrl,
			repliedTo: messageDto.repliedTo,
			status: messageDto.status,
			createdAt: messageDto.createdAt,
			updatedAt: messageDto.updatedAt,
		};

		await this._eventBus.publish(
			new MessageSentEvent({
				chatId: chat.id,
				receiverId,
				message: messagePayload,
				senderName,
				receiverName,
			}),
		);

		return { message: messageDto };
	}
}

import { inject, injectable } from "inversify";
import type {
	IChatMessageRepository,
	IChatRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type {
	MarkMessagesReadInput,
	MarkMessagesReadOutput,
} from "../dtos/chat.dto";
import { ChatAccessDeniedError, ChatNotFoundError } from "../errors";
import type { IMarkMessagesReadUseCase } from "./mark-messages-read.usecase.interface";

@injectable()
export class MarkMessagesReadUseCase implements IMarkMessagesReadUseCase {
	constructor(
		@inject(TYPES.Repositories.ChatRepository)
		private readonly _chatRepository: IChatRepository,
		@inject(TYPES.Repositories.ChatMessageRepository)
		private readonly _chatMessageRepository: IChatMessageRepository,
	) {}

	async execute(input: MarkMessagesReadInput): Promise<MarkMessagesReadOutput> {
		const chat = await this._chatRepository.findById(input.chatId);
		if (!chat) {
			throw new ChatNotFoundError();
		}

		if (!chat.hasParticipant(input.readerId)) {
			throw new ChatAccessDeniedError();
		}

		const updatedCount = await this._chatMessageRepository.markAsRead(
			input.chatId,
			input.readerId,
		);

		chat.markRead(input.readerId);

		await this._chatRepository.updateById(chat.id, {
			unreadCount: chat.unreadCount,
		});

		// TODO: Publish a "chat.messages.read" domain event for websocket sync.
		return { updatedCount };
	}
}

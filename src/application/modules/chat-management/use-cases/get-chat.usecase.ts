import { inject, injectable } from "inversify";
import type {
	IChatMessageRepository,
	IChatRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { GetChatInput, GetChatOutput } from "../dtos/chat.dto";
import { ChatMapper } from "../mappers/chat.mapper";
import { ChatMessageMapper } from "../mappers/chat-message.mapper";
import type { ICreateChatUseCase } from "./create-chat.usecase.interface";
import type { IGetChatUseCase } from "./get-chat.usecase.interface";

const CHAT_MESSAGES_PAGE_SIZE = 10;

@injectable()
export class GetChatUseCase implements IGetChatUseCase {
	constructor(
		@inject(TYPES.Repositories.ChatRepository)
		private readonly _chatRepository: IChatRepository,
		@inject(TYPES.Repositories.ChatMessageRepository)
		private readonly _chatMessageRepository: IChatMessageRepository,
		@inject(TYPES.UseCases.CreateChat)
		private readonly _createChatUseCase: ICreateChatUseCase,
	) {}

	async execute(input: GetChatInput): Promise<GetChatOutput> {
		const existing = await this._chatRepository.findByParticipants(
			input.userId,
			input.otherUserId,
		);

		if (!existing) {
			const created = await this._createChatUseCase.execute({
				userId: input.userId,
				otherUserId: input.otherUserId,
			});

			return {
				chat: created.chat,
				messages: [],
				total: 0,
				page: 1,
				limit: CHAT_MESSAGES_PAGE_SIZE,
				totalPages: 0,
			};
		}

		const result = await this._chatMessageRepository.paginate({
			page: input.page ?? 1,
			limit: CHAT_MESSAGES_PAGE_SIZE,
			query: { chatId: existing.id },
			sort: { createdAt: -1 },
		});

		return {
			chat: ChatMapper.toDto(existing),
			messages: result.items.map((item) => ChatMessageMapper.toDto(item)),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}

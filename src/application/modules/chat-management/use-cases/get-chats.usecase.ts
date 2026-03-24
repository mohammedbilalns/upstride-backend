import { inject, injectable } from "inversify";
import type { IChatRepository } from "../../../../domain/repositories/chat.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { GetChatsInput, GetChatsOutput } from "../dtos/chat.dto";
import { ChatMapper } from "../mappers/chat.mapper";
import type { IGetChatsUseCase } from "./get-chats.usecase.interface";

const CHAT_PAGE_SIZE = 10;

@injectable()
export class GetChatsUseCase implements IGetChatsUseCase {
	constructor(
		@inject(TYPES.Repositories.ChatRepository)
		private readonly _chatRepository: IChatRepository,
	) {}

	async execute(input: GetChatsInput): Promise<GetChatsOutput> {
		// TODO: Publish a "chats.fetched" domain event for websocket sync if needed.
		const result = await this._chatRepository.paginateByUser(
			input.userId,
			input.filter ?? "all",
			input.page ?? 1,
			CHAT_PAGE_SIZE,
		);

		return {
			chats: ChatMapper.toDtos(result.items),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}

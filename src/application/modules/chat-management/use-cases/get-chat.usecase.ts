import { inject, injectable } from "inversify";
import type { IChatRepository } from "../../../../domain/repositories/chat.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { GetChatInput, GetChatOutput } from "../dtos/chat.dto";
import { ChatMapper } from "../mappers/chat.mapper";
import type { ICreateChatUseCase } from "./create-chat.usecase.interface";
import type { IGetChatUseCase } from "./get-chat.usecase.interface";

@injectable()
export class GetChatUseCase implements IGetChatUseCase {
	constructor(
		@inject(TYPES.Repositories.ChatRepository)
		private readonly _chatRepository: IChatRepository,
		@inject(TYPES.UseCases.CreateChat)
		private readonly _createChatUseCase: ICreateChatUseCase,
	) {}

	async execute(input: GetChatInput): Promise<GetChatOutput> {
		const existing = await this._chatRepository.findByParticipants(
			input.userId,
			input.otherUserId,
		);

		if (existing) {
			return { chat: ChatMapper.toDto(existing) };
		}

		const created = await this._createChatUseCase.execute({
			userId: input.userId,
			otherUserId: input.otherUserId,
		});

		return { chat: created.chat };
	}
}

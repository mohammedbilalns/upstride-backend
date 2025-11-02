import { IChatRepository } from "../../domain/repositories";
import { IGetChatsUC } from "../../domain/useCases/getChats.uc.interface";
import { getChatsDto, getChatsResult } from "../dtos/getChats.dto";

// retrieve user chats
export class GetChatsUC implements IGetChatsUC {
	constructor(private _chatRepository: IChatRepository) {}

	async execute(dto: getChatsDto): Promise<getChatsResult> {
		const { userId, page, limit } = dto;
		const { chats, total } = await this._chatRepository.getUserChats(
			userId,
			page,
			limit,
		);
		// TODO: fetch user data from the identity service
		return { chats, total };
	}
}

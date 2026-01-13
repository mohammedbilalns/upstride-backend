import type {
	GetChatsDto,
	GetChatsResult,
} from "../../application/dtos/get-chats.dto";

export interface IGetChatsUC {
	execute(dto: GetChatsDto): Promise<GetChatsResult>;
}

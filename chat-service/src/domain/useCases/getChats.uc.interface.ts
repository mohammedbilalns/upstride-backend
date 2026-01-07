import type {
	GetChatsDto,
	GetChatsResult,
} from "../../application/dtos/getChats.dto";

export interface IGetChatsUC {
	execute(dto: GetChatsDto): Promise<GetChatsResult>;
}

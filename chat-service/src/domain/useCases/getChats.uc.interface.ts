import type {
	getChatsDto,
	getChatsResult,
} from "../../application/dtos/getChats.dto";

export interface IGetChatsUC {
	execute(dto: getChatsDto): Promise<getChatsResult>;
}

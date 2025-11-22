import type {
	getChatDto,
	getChatResult,
} from "../../application/dtos/getChat.dto";

export interface IGetChatUC {
	execute(dto: getChatDto): Promise<getChatResult>;
}

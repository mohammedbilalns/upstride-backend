import type {
	GetChatDto,
	GetChatResult,
} from "../../application/dtos/getChat.dto";

export interface IGetChatUC {
	execute(dto: GetChatDto): Promise<GetChatResult>;
}

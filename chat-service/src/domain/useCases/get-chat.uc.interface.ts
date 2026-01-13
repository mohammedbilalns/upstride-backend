import type {
	GetChatDto,
	GetChatResult,
} from "../../application/dtos/get-chat.dto";

export interface IGetChatUC {
	execute(dto: GetChatDto): Promise<GetChatResult>;
}

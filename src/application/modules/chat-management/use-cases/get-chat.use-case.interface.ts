import type { GetChatInput, GetChatOutput } from "../dtos/chat.dto";

export interface IGetChatUseCase {
	execute(input: GetChatInput): Promise<GetChatOutput>;
}

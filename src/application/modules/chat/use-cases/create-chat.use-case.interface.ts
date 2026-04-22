import type { CreateChatInput, CreateChatOutput } from "../dtos/chat.dto";

export interface ICreateChatUseCase {
	execute(input: CreateChatInput): Promise<CreateChatOutput>;
}

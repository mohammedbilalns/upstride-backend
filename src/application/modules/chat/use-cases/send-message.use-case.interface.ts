import type { SendMessageInput, SendMessageOutput } from "../dtos/chat.dto";

export interface ISendMessageUseCase {
	execute(input: SendMessageInput): Promise<SendMessageOutput>;
}

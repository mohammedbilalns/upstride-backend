import type {
	MarkMessagesReadInput,
	MarkMessagesReadOutput,
} from "../dtos/chat.dto";

export interface IMarkMessagesReadUseCase {
	execute(input: MarkMessagesReadInput): Promise<MarkMessagesReadOutput>;
}

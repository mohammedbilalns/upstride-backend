import type { CreateFeedbackInput } from "../dtos/feedback.dto";

export interface ICreateFeedbackUseCase {
	execute(input: CreateFeedbackInput): Promise<void>;
}

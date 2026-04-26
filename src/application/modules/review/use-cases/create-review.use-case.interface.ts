import type { CreateReviewInput, CreateReviewOutput } from "../dtos/review.dto";

export interface ICreateReviewUseCase {
	execute(input: CreateReviewInput): Promise<CreateReviewOutput>;
}

import type {
	GetMentorReviewsInput,
	GetMentorReviewsOutput,
} from "../dtos/review.dto";

export interface IGetMentorReviewsUseCase {
	execute(input: GetMentorReviewsInput): Promise<GetMentorReviewsOutput>;
}

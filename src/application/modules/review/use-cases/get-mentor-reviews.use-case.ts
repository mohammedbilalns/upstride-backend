import { inject, injectable } from "inversify";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import type { IReviewRepository } from "../../../../domain/repositories/review.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import type {
	GetMentorReviewsInput,
	GetMentorReviewsOutput,
} from "../dtos/review.dto";
import type { IGetMentorReviewsUseCase } from "./get-mentor-reviews.use-case.interface";

@injectable()
export class GetMentorReviewsUseCase implements IGetMentorReviewsUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorProfileReadRepository: IMentorProfileReadRepository,
		@inject(TYPES.Repositories.ReviewRepository)
		private readonly _reviewRepository: IReviewRepository,
	) {}

	async execute(input: GetMentorReviewsInput): Promise<GetMentorReviewsOutput> {
		const mentor = await this._mentorProfileReadRepository.findProfileById(
			input.mentorId,
		);
		if (!mentor) {
			throw new NotFoundError("Mentor not found");
		}

		const page = input.page || 1;
		const limit = 5;
		const result = await this._reviewRepository.paginateByMentorId(
			input.mentorId,
			page,
			limit,
		);

		return {
			reviews: result.items,
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}

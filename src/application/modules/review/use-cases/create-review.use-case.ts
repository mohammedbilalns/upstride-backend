import { inject, injectable } from "inversify";
import { Review } from "../../../../domain/entities/review.entity";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { IReviewRepository } from "../../../../domain/repositories/review.repository.interface";
import { ReviewMapper } from "../../../../infrastructure/database/mongodb/mappers/review.mapper";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import { ConflictError } from "../../../shared/errors/conflict-error";
import { ValidationError } from "../../../shared/errors/validation-error";
import { UnauthorizedError } from "../../authentication/errors";
import { BookingNotFoundError } from "../../booking/errors/booking.errors";
import type { CreateReviewInput, CreateReviewOutput } from "../dtos/review.dto";
import type { ICreateReviewUseCase } from "./create-review.use-case.interface";

@injectable()
export class CreateReviewUseCase implements ICreateReviewUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
		@inject(TYPES.Repositories.ReviewRepository)
		private readonly _reviewRepository: IReviewRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute(input: CreateReviewInput): Promise<CreateReviewOutput> {
		const booking = await this._bookingRepository.findById(input.bookingId);
		if (!booking) {
			throw new BookingNotFoundError();
		}

		if (booking.menteeId !== input.userId) {
			throw new UnauthorizedError(
				"You are not authorized to review this session",
			);
		}

		if (new Date(booking.endTime).getTime() > Date.now()) {
			throw new ValidationError(
				"Reviews can only be added after the session end time.",
			);
		}

		if (
			booking.paymentStatus !== "COMPLETED" ||
			booking.status !== "COMPLETED" ||
			!booking.settledAt
		) {
			throw new ValidationError(
				"Only completed sessions with mentor attendance can be reviewed.",
			);
		}

		const existingReview = await this._reviewRepository.findByBookingId(
			booking.id,
		);
		if (existingReview) {
			throw new ConflictError("You have already reviewed this booking");
		}

		const review = new Review(
			this._idGenerator.generate(),
			booking.mentorId,
			input.userId,
			booking.id,
			input.rating,
			input.comment,
			new Date(),
			new Date(),
		);

		const created = await this._reviewRepository.create(review);
		const stats = await this._reviewRepository.getStatsByMentorId(
			booking.mentorId,
		);
		const mentor = await this._mentorRepository.findById(booking.mentorId);
		if (mentor) {
			const averageRating =
				stats.count > 0 ? Math.round(stats.averageRating * 100) / 100 : 0;
			await this._mentorRepository.updateById(mentor.id, {
				avgRating: averageRating,
			});
		}

		return {
			review: ReviewMapper.toDto(created),
		};
	}
}

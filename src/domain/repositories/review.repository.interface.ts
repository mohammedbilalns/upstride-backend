import type { Review } from "../entities/review.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatedResult,
} from "./capabilities";

export interface ReviewSummary {
	id: string;
	mentorId: string;
	userId: string;
	bookingId: string;
	rating: number;
	comment: string;
	reviewerName: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface ReviewStats {
	count: number;
	averageRating: number;
}

export interface IReviewRepository
	extends CreatableRepository<Review>,
		FindByIdRepository<Review> {
	findByBookingId(bookingId: string): Promise<Review | null>;
	findByBookingIds(bookingIds: string[]): Promise<Review[]>;
	paginateByMentorId(
		mentorId: string,
		page: number,
		limit: number,
	): Promise<PaginatedResult<ReviewSummary>>;
	getStatsByMentorId(mentorId: string): Promise<ReviewStats>;
}

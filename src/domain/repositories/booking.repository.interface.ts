import type { Booking } from "../entities/booking.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatedResult,
	UpdatableByIdRepository,
} from "./capabilities";

export type BookingFilter =
	| "all"
	| "upcoming"
	| "past"
	| "completed"
	| "cancelled"
	| "upcoming_cancelled"
	| "past_cancelled"
	| "payment_pending";

export interface IBookingRepository
	extends CreatableRepository<Booking>,
		FindByIdRepository<Booking>,
		UpdatableByIdRepository<Booking> {
	create(entity: Booking): Promise<Booking>;

	findOverlapping(
		mentorId: string,
		startTime: Date,
		endTime: Date,
	): Promise<Booking[]>;

	findOverlappingForUser(
		userId: string,
		mentorId: string | null,
		startTime: Date,
		endTime: Date,
	): Promise<Booking[]>;

	paginateByMentee(
		menteeId: string,
		filter: BookingFilter,
		page: number,
		limit: number,
	): Promise<PaginatedResult<Booking>>;

	paginateByMentor(
		mentorId: string,
		filter: BookingFilter,
		page: number,
		limit: number,
	): Promise<PaginatedResult<Booking>>;

	findByMentorIdAndDate(
		mentorId: string,
		date: Date,
		options?: { includeFailed?: boolean },
	): Promise<Booking[]>;
}

import type { Booking } from "../entities/booking.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatedResult,
	UpdatableByIdRepository,
} from "./capabilities";

export type BookingFilter = "all" | "upcoming" | "past" | "cancelled";

export interface IBookingRepository
	extends CreatableRepository<Booking>,
		FindByIdRepository<Booking>,
		UpdatableByIdRepository<Booking> {
	findOverlapping(
		mentorId: string,
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

	findByMentorIdAndDate(mentorId: string, date: Date): Promise<Booking[]>;
}

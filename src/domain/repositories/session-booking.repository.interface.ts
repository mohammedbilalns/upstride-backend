import type { SessionBooking } from "../entities/session-booking.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export type SessionBookingFilter = "all" | "past" | "cancelled" | "upcoming";

export interface ISessionBookingRepository
	extends CreatableRepository<SessionBooking>,
		FindByIdRepository<SessionBooking>,
		UpdatableByIdRepository<SessionBooking> {
	findByUserId(userId: string): Promise<SessionBooking[]>;
	findByMentorId(mentorId: string): Promise<SessionBooking[]>;
	paginateByUser(
		userId: string,
		filter: SessionBookingFilter,
		page: number,
		limit: number,
	): Promise<{
		items: SessionBooking[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
	paginateByMentor(
		mentorId: string,
		filter: SessionBookingFilter,
		page: number,
		limit: number,
		excludeUserId?: string,
	): Promise<{
		items: SessionBooking[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
}

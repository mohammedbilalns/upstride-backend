import type { SessionBooking } from "../entities/session-booking.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ISessionBookingRepository
	extends CreatableRepository<SessionBooking>,
		FindByIdRepository<SessionBooking>,
		UpdatableByIdRepository<SessionBooking> {
	findByUserId(userId: string): Promise<SessionBooking[]>;
	findByMentorId(mentorId: string): Promise<SessionBooking[]>;
}

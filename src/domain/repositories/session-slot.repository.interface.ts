import type { SessionSlot } from "../entities/session-slot.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ISessionSlotRepository
	extends CreatableRepository<SessionSlot>,
		FindByIdRepository<SessionSlot>,
		UpdatableByIdRepository<SessionSlot> {
	findByMentorId(mentorId: string): Promise<SessionSlot[]>;
	findByMentorIdAndRange(
		mentorId: string,
		startDate: Date,
		endDate: Date,
	): Promise<SessionSlot[]>;
	findAvailableByMentorIdAndRange(
		mentorId: string,
		startDate: Date,
		endDate: Date,
	): Promise<SessionSlot[]>;
	findUpcomingAvailableByMentorId(
		mentorId: string,
		limit: number,
		startTime?: Date,
	): Promise<SessionSlot[]>;
	findOverlapping(
		mentorId: string,
		startTime: Date,
		endTime: Date,
	): Promise<SessionSlot[]>;
	deleteById(id: string): Promise<void>;
}

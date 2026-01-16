import type { Slot } from "../entities/slot.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface ISlotRepository extends IBaseRepository<Slot> {
	find(filter: Partial<Slot>): Promise<Slot[]>;

	findOverlappingSlots(
		mentorId: string,
		startAt: Date,
		endAt: Date,
	): Promise<Slot | null>;

	toggleSlotStatusByRuleId(ruleId: string, isActive: boolean): Promise<void>;

	findUpcomingByMentor(
		mentorId: string,
		now?: Date,
		startDate?: Date,
		endDate?: Date,
		userId?: string,
	): Promise<Slot[]>;
	deleteUnbookedFutureSlots(ruleId: string): Promise<void>;
	updatePriceForFutureSlots(
		mentorId: string,
		durationInMinutes: number,
		newPrice: number,
	): Promise<void>;
	findInTimeRange(start: Date, end: Date, status?: string): Promise<Slot[]>;
	countFutureSlotsByMentor(mentorId: string): Promise<number>;
}

import type { Slot } from "../entities/slot.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface ISlotRepository extends IBaseRepository<Slot> {
	find(filter: Partial<Slot>): Promise<Slot[]>;

	findOverlappingSlots(
		mentorId: string,
		startAt: Date,
		endAt: Date,
	): Promise<Slot | null>;
}

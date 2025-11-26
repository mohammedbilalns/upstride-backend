import type { Slot } from "../entities/slot.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface ISlotRepository extends IBaseRepository<Slot> {
	find(mentorId: string): Promise<Slot[]>;
}

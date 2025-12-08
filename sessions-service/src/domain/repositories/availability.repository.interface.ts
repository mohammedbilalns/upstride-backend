import type { Availability } from "../entities/availability.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IAvailabilityRepository extends IBaseRepository<Availability> {
	findByMentorId(mentorId: string): Promise<Availability | null>;
	fetchOrCreateByMentorId(mentorId: string): Promise<Availability>;
}

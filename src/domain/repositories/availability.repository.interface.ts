import type { Availability } from "../entities/availability.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export type AvailabilityFilter = {
	mentorId: string;
	date?: string;
};

export interface IAvailabilityRepository
	extends CreatableRepository<Availability>,
		FindByIdRepository<Availability>,
		UpdatableByIdRepository<Availability> {
	findByMentorId(mentorId: string): Promise<Availability[]>;
	findActiveByMentorIdAndDate(
		mentorId: string,
		date: Date,
	): Promise<Availability[]>;
	deleteById(id: string): Promise<void>;
}

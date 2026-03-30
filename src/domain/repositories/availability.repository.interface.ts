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
	findByMentorId(
		mentorId: string,
		options?: { activeOnly?: boolean; expired?: boolean },
	): Promise<Availability[]>;

	findActiveByMentorIdAndDate(
		mentorId: string,
		date: Date,
	): Promise<Availability[]>;
	updateStatus(id: string, status: boolean): Promise<void>;
	deleteById(id: string): Promise<void>;
}

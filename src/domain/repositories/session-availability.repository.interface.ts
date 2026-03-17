import type { Availability } from "../entities/session-availability.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	FindByOwnerRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ISessionAvailabilityRepository
	extends CreatableRepository<Availability>,
		FindByIdRepository<Availability>,
		FindByOwnerRepository<Availability>,
		UpdatableByIdRepository<Availability> {}

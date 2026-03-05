import type { Interest } from "../entities/interest.entity";
import type {
	CreatableRepository,
	DisablableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface InterestQuery {
	name?: string;
}

export interface IInterestRepository
	extends CreatableRepository<Interest>,
		UpdatableByIdRepository<Interest>,
		QueryableRepository<Interest, InterestQuery>,
		DisablableRepository {}

import type { Interest } from "../entities/interest.entity";
import type {
	CreatableRepository,
	DisablableRepository,
	EnableableRepository,
	FindByIdRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface InterestQuery {
	name?: string;
	slug?: string;
}

export interface IInterestRepository
	extends CreatableRepository<Interest>,
		FindByIdRepository<Interest>,
		UpdatableByIdRepository<Interest>,
		QueryableRepository<Interest, InterestQuery>,
		DisablableRepository,
		EnableableRepository {}

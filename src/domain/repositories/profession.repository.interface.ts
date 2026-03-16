import type { Profession } from "../entities/profession.entity";
import type {
	CreatableRepository,
	DisablableRepository,
	EnableableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ProfessionQuery {
	name?: string;
	slug?: string;
}

export interface IProfessionRepository
	extends CreatableRepository<Profession>,
		UpdatableByIdRepository<Profession>,
		QueryableRepository<Profession, ProfessionQuery>,
		DisablableRepository,
		EnableableRepository {
	findAllActive(): Promise<Profession[]>;
}

import type { Profession } from "../entities/profession.entity";
import type {
	CreatableRepository,
	DisablableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ProfessionQuery {
	name?: string;
}

export interface IProfessionRepository
	extends CreatableRepository<Profession>,
		UpdatableByIdRepository<Profession>,
		QueryableRepository<Profession, ProfessionQuery>,
		DisablableRepository {
	findAllActive(): Promise<Profession[]>;
}

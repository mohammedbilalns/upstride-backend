import type { Skill } from "../entities/skill.entity";
import type {
	CreatableRepository,
	DisablableRepository,
	EnableableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface SkillQuery {
	name?: string;
	slug?: string;
	interestId?: string;
}

export interface ISkillRepository
	extends CreatableRepository<Skill>,
		UpdatableByIdRepository<Skill>,
		QueryableRepository<Skill, SkillQuery>,
		DisablableRepository,
		EnableableRepository {
	countByInterestId(interestId: string): Promise<number>;
}

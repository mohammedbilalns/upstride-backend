import type { Skill } from "../entities/skill.entity";
import type {
	CreatableRepository,
	DisablableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface SkillQuery {
	name?: string;
}

export interface ISkillRepository
	extends CreatableRepository<Skill>,
		UpdatableByIdRepository<Skill>,
		QueryableRepository<Skill, SkillQuery>,
		DisablableRepository {}

import type { Skill } from "../entities/skill.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface ISkillRepository extends IBaseRepository<Skill> {
	findAll(
		expertiseId: string,
		page?: number,
		limit?: number,
		query?: string,
		isForUser?: boolean,
	): Promise<Skill[]>;
	exists(name: string, expertiseId: string): Promise<boolean>;
	count(expertiseId?: string, query?: string): Promise<number>;
}

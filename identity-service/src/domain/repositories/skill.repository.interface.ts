import { IBaseRepository } from "./base.repository.interface";
import { Skill } from "../entities/skill.entity";

export interface ISkillRepository extends IBaseRepository<Skill> {
  findAll(
    expertiseId: string,
    page: number,
    limit: number,
    query?: string,
  ): Promise<Skill[]>;
  exists(name: string, expertiseId: string): Promise<boolean>;
  count(expertiseId?: string, query?: string): Promise<number>;
}

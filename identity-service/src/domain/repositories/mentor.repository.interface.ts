import { IBaseRepository } from "./base.repository.interface";
import { Mentor } from "../entities/mentor.entity";

export interface IMentorRepository extends IBaseRepository<Mentor> {
  findAll(page: number, limit: number, query?: string): Promise<Mentor[]>;
	findByExpertiseandSkill(expertiseId: string, skillId: string, page: number, limit: number,query?:string): Promise<Mentor[]>;
}

import { IBaseRepository } from "./base.repository.interface";
import { Mentor } from "../entities/mentor.entity";
import { findAllMentorsDto } from "../../application/dtos";

export interface IMentorRepository extends IBaseRepository<Mentor> {
  findAll(params: findAllMentorsDto): Promise<Mentor[]>;
  findByExpertiseandSkill(
    expertiseId: string,
    skillId: string,
    page: number,
    limit: number,
    query?: string,
  ): Promise<Mentor[]>;
  count(query?: string, status?: string): Promise<number>;
}

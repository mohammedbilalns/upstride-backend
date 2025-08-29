import { IBaseRepository } from "./base.repository.interface";
import { Mentor } from "../entities/mentor.entity";

export interface IMenotorRepository extends IBaseRepository<Mentor> {
  findByUserId(userId: string): Promise<Mentor | null>;
  findAll(
    page: number,
    limit: number,
    query?: string,
    expertiseId?: string,
    skillIds?: string[],
  ): Promise<Mentor[]>;

  count(
    query?: string,
    expertiseId?: string,
    skillIds?: string[],
  ): Promise<number>;
}

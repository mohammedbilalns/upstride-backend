import { IBaseRepository } from "./base.repository.interface";
import { Mentor } from "../entities/mentor.entity";

export interface IMenotorRepository extends IBaseRepository<Mentor> {
  findAll(page: number, limit: number): Promise<Mentor[]>;
}

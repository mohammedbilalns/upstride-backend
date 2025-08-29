import { IBaseRepository } from "./base.repository.interface";
import { Expertise } from "../entities/expertise.entity";

export interface IExpertiseRepository extends IBaseRepository<Expertise> {
  findAll(page: number, limit: number, query: string): Promise<Expertise[]>;
}

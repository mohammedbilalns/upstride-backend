import { IBaseRepository } from "./base.repository.interface";
import { Expert } from "../entities/expert.entity";

export interface IExpertRepository extends IBaseRepository<Expert> {
 findAll(page: number, limit: number): Promise<Expert[]>;
}


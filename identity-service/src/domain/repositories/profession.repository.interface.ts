import { IBaseRepository } from "./base.repository.interface";
import { Profession } from "../entities/profession.entity";

export interface IProfessionRepository extends IBaseRepository<Profession> {
 findAll(page: number, limit: number): Promise<Profession[]>;

}

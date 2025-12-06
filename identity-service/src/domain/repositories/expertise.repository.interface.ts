import type { Expertise } from "../entities/expertise.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IExpertiseRepository extends IBaseRepository<Expertise> {
	findAll(
		page: number,
		limit: number,
		query?: string,
		isUser?: boolean,
	): Promise<Expertise[]>;
	createIfNotExists(expertise: Partial<Expertise>): Promise<Expertise>;
	count(query?: string, isUser?: boolean): Promise<number>;
}

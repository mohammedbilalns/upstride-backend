import type { findAllMentorsDto } from "../../application/dtos";
import type { Mentor } from "../entities/mentor.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IMentorRepository extends IBaseRepository<Mentor> {
	findAll(params: findAllMentorsDto): Promise<Mentor[]>;
	findByUserId(userId: string): Promise<Mentor | null>;
	findByExpertiseandSkill(
		expertiseId: string,
		skillId: string,
		page: number,
		limit: number,
		query?: string,
	): Promise<Mentor[]>;
	count(query?: string, status?: string): Promise<number>;
	findByExpertiseId(expertiseId: string): Promise<Mentor[]>;
}

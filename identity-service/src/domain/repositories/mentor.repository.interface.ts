import type { findAllMentorsDto } from "../../application/dtos";
import type { Mentor } from "../entities/mentor.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IMentorRepository extends IBaseRepository<Mentor> {
	findAll(params: findAllMentorsDto): Promise<Mentor[]>;
	findByUserId(userId: string, populate?: boolean): Promise<Mentor | null>;
	findByExpertiseandSkill(
		page: number,
		limit: number,
		userId: string,
		expertiseId?: string,
		skillId?: string,
		query?: string,
	): Promise<{ mentors: Mentor[]; total: number }>;
	count(query?: string, status?: string): Promise<number>;
	findByExpertiseId(expertiseId: string): Promise<Mentor[]>;
	findActiveExpertisesAndSkills(): Promise<{
		expertises: string[];
		skills: string[];
	}>;
	fetchSuggestedMentors(
		userId: string,
		expertiseIds: string[],
		skillIds: string[],
		page: number,
		limit: number,
	): Promise<{ mentors: any[] }>;
}

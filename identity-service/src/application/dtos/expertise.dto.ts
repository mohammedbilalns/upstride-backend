import type { UserRole } from "../../common/enums/userRoles";

export interface createExpertiseDto {
	name: string;
	description: string;
	skills: string[];
}

export interface updateExpertiseDto {
	expertiseId: string;
	name?: string;
	description?: string;
	isVerified?: boolean;
}

export interface fetchExpertiseDto {
	page: number;
	limit: number;
	query?: string;
	userRole: UserRole;
}

export interface fetchSkillsFromMultipleExpertiseDto {
	expertise: string[];
}

interface BaseSkillResponse {
	id: string;
	name: string;
	expertiseId: string;
}

interface AdminSkillResponse {
	isVerified: boolean;
}

type SkillResponse = BaseSkillResponse & Partial<AdminSkillResponse>;

export interface FetchSkillsResponse {
	expertises: SkillResponse[];
	total: number;
}

interface BaseExpertiseResponse {
	id: string;
	name: string;
}

interface AdminExpertiseResponse {
	description?: string;
	isVerified: boolean;
}

type ExpertiseResponse = BaseExpertiseResponse &
	Partial<AdminExpertiseResponse>;

export interface FetchExpertisesResponse {
	data: ExpertiseResponse[];
	total: number;
}

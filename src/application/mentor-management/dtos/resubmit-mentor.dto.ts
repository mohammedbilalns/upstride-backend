import type { SkillLevel } from "../../../domain/entities/user.entity";

export interface ResubmitMentorExperienceInput {
	company?: string;
	role?: string;
	description?: string;
	from?: string;
	to?: string | null;
}

export interface ResubmitMentorSkillInput {
	skillId?: string;
	level?: SkillLevel;
}

export interface ResubmitMentorInput {
	userId: string;
	bio?: string;
	currentRoleId?: string;
	organization?: string;
	yearsOfExperience?: number;
	personalWebsite?: string;
	resumeId?: string;
	educationalQualifications?: string[];
	areasOfExpertise?: string[];
	toolsAndSkills?: ResubmitMentorSkillInput[];
	experience?: ResubmitMentorExperienceInput[];
}

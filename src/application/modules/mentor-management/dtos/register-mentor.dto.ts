import type { SkillLevel } from "../../../../domain/entities/user.entity";

export interface RegisterMentorExperienceInput {
	company: string;
	role: string;
	description: string;
	from: string;
	to: string | null;
}

export interface RegisterMentorSkillInput {
	skillId: string;
	level: SkillLevel;
}

export interface RegisterMentorInput {
	userId: string;
	bio: string;
	currentRoleId: string;
	organization: string;
	yearsOfExperience: number;
	personalWebsite: string;
	resumeId: string;
	educationalQualifications: string[];
	areasOfExpertise: string[];
	toolsAndSkills: RegisterMentorSkillInput[];
	experience: RegisterMentorExperienceInput[];
}

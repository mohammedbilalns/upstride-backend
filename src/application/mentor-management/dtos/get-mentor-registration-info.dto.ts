import type { SkillLevel } from "../../../domain/entities/user.entity";

export interface MentorExperienceDto {
	company: string;
	role: string;
	description: string;
	from: Date;
	to: Date | null;
}

export interface MentorSkillDto {
	skillId: string;
	level: SkillLevel;
}

export interface MentorDto {
	id: string;
	userId: string;
	bio: string;
	currentRoleId: string;
	organization: string;
	yearsOfExperience: number;
	personalWebsite: string;
	resumeId: string;
	educationalQualifications: string[];
	areasOfExpertise: string[];
	toolsAndSkills: MentorSkillDto[];
	experience: MentorExperienceDto[];
	isApproved: boolean;
	applicationAttempts: number;
	isRejected: boolean;
	updatedAt: Date;
	rejectionReason: string | null;
}

export interface GetMentorRegistrationInfoInput {
	userId: string;
}

export interface MentorRegistrationInfoOutput {
	canApply: boolean;
	attemptsCount: number;
	maxAttempts: number;
	existingProfile: MentorDto | null;
	rejectionReason: string | null;
}

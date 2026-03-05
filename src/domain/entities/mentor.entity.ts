import { ValidationError } from "../../application/shared/errors/validation-error";
import type { SkillLevel } from "./user.entity";

export const MAX_MENTOR_APPLICATION_ATTEMPTS = 3;
export const MAX_MENTOR_EXPERIENCE_ITEMS = 7;
export const MAX_MENTOR_AREAS_OF_EXPERTISE = 2;

export interface MentorExperience {
	company: string;
	role: string;
	description: string;
	from: Date;
	to: Date | null;
}

export interface MentorSkill {
	skillId: string;
	level: SkillLevel;
}

export class Mentor {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly bio: string,
		public readonly currentRoleId: string,
		public readonly organization: string,
		public readonly yearsOfExperience: number,
		public readonly personalWebsite: string,
		public readonly resumeId: string,
		public readonly educationalQualifications: string[],
		public readonly areasOfExpertise: string[],
		public readonly toolsAndSkills: MentorSkill[],
		public readonly experience: MentorExperience[],
		public readonly isApproved: boolean,
		public readonly applicationAttempts: number,
		public readonly isRejected: boolean,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
		public readonly rejectionReason: string | null = null,
	) {
		if (this.experience.length > 7) {
			throw new ValidationError("Maximum of 7 experience items allowed.");
		}
		if (this.applicationAttempts > 3) {
			throw new ValidationError("Maximum of 3 application attempts allowed.");
		}
		if (this.areasOfExpertise.length > 2) {
			throw new ValidationError("Maximum of 2 areas of expertise allowed.");
		}
	}
}

import { EntityValidationError } from "../errors";
import type { SkillLevel } from "./user.entity";
export const MAX_MENTOR_APPLICATION_ATTEMPTS = 3;
export const MAX_MENTOR_EXPERIENCE_ITEMS = 7;
export const MAX_MENTOR_AREAS_OF_EXPERTISE = 2;
export const MAX_MENTOR_EDUCATION_ITEMS = 5;
export const MAX_MENTORS_PER_LIST = 150;
export const MAX_LISTS_PER_USER = 20;

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
		public readonly score: number,
		public readonly tierName: string | null,
		public readonly tierMax30minPayment: number | null,
		public readonly currentPricePer30Min: number | null,
		public readonly personalWebsite: string | null,
		public readonly resumeId: string,
		public readonly educationalQualifications: string[],
		public readonly areasOfExpertise: string[],
		public readonly toolsAndSkills: MentorSkill[],
		public readonly experience: MentorExperience[],
		public readonly isApproved: boolean,
		public readonly applicationAttempts: number,
		public readonly skippedSessionsCount: number,
		public readonly isRejected: boolean,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
		public readonly rejectionReason: string | null = null,
		public readonly avgRating: number = 0,
		public readonly isUserBlocked: boolean = false,
	) {
		if (this.score < 0 || this.score > 100) {
			throw new EntityValidationError(
				"score",
				"Score must be between 0 and 100.",
			);
		}
		if (
			(this.tierName === null && this.tierMax30minPayment !== null) ||
			(this.tierName !== null && this.tierMax30minPayment === null)
		) {
			throw new EntityValidationError(
				"score",
				"Tier name and tier max 30 min payment must be set together.",
			);
		}
		if (
			this.currentPricePer30Min !== null &&
			(this.currentPricePer30Min < 100 || this.currentPricePer30Min > 10000)
		) {
			throw new EntityValidationError(
				"score",
				"Current price per 30 min must be between 100 and 10000.",
			);
		}
		if (this.experience.length > 7) {
			throw new EntityValidationError(
				"socre",
				"Maximum of 7 experience items allowed.",
			);
		}
		if (this.applicationAttempts > 3) {
			throw new EntityValidationError(
				"score",
				"Maximum of 3 application attempts allowed.",
			);
		}
		if (this.skippedSessionsCount < 0) {
			throw new EntityValidationError(
				"score",
				"Skipped sessions count cannot be negative.",
			);
		}
		if (this.areasOfExpertise.length > 2) {
			throw new EntityValidationError(
				"score",
				"Maximum of 2 areas of expertise allowed.",
			);
		}
		if (this.educationalQualifications.length > MAX_MENTOR_EDUCATION_ITEMS) {
			throw new EntityValidationError(
				"score",
				`Maximum of ${MAX_MENTOR_EDUCATION_ITEMS} educational qualifications allowed.`,
			);
		}
	}
}

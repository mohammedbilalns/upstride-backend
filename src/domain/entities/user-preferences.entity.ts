import { UserPreferencesLimits } from "../../shared/constants/app.constants";
import { EntityValidationError } from "../errors";
import type { AuthType, SkillLevel, UserRole } from "./user.entity";

export interface PopulatedInterest {
	_id?: { toString(): string };
	id?: { toString(): string };
	name: string;
}

export interface PopulatedSkill {
	skillId: {
		_id?: { toString(): string };
		id?: { toString(): string };
		name: string;
		interestId: { toString(): string };
	};
	level: SkillLevel;
}

export interface UserWithPopulatedPreferences {
	id: string;
	name: string;
	email: string;
	phone: string;
	coinBalance: number;
	role: UserRole;
	authType: AuthType;
	profilePictureId: string | null;
	preferences?: {
		interests: PopulatedInterest[];
		skills: PopulatedSkill[];
	};
}

export interface RawUserPreferences {
	interests: string[];
	skills: Array<{ skillId: string; level: SkillLevel }>;
}

/**
 * UserPreferences value object.
 */
export class UserPreferences {
	private constructor(
		public readonly interests: string[],
		public readonly skills: Array<{ skillId: string; level: SkillLevel }>,
	) {}

	static create(
		interests: string[],
		skills: Array<{ skillId: string; level: SkillLevel }>,
	): UserPreferences {
		if (
			interests.length < UserPreferencesLimits.MIN_INTERESTS ||
			interests.length > UserPreferencesLimits.MAX_INTERESTS
		) {
			throw new EntityValidationError(
				"UserPreferences",
				`Interests must be between ${UserPreferencesLimits.MIN_INTERESTS} and ${UserPreferencesLimits.MAX_INTERESTS}.`,
			);
		}

		const maxSkills =
			UserPreferencesLimits.MAX_INTERESTS *
			UserPreferencesLimits.MAX_SKILLS_PER_INTEREST;
		if (
			skills.length < UserPreferencesLimits.MIN_SKILLS_PER_INTEREST ||
			skills.length > maxSkills
		) {
			throw new EntityValidationError(
				"UserPreferences",
				`Skills must be between ${UserPreferencesLimits.MIN_SKILLS_PER_INTEREST} and ${maxSkills}.`,
			);
		}

		return new UserPreferences(interests, skills);
	}

	toRaw(): RawUserPreferences {
		return { interests: this.interests, skills: this.skills };
	}
}

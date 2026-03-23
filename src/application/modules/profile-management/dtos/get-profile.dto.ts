import type {
	AuthType,
	SkillLevel,
	UserRole,
} from "../../../../domain/entities/user.entity";

export interface GetProfileInput {
	userId: string;
}

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

//FIX: move to the entity as it is being used in the abstract repo
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

export interface UserProfileDTO {
	id: string;
	name: string;
	email: string;
	phone: string;
	coinBalance: number;
	role: UserRole;
	authType: AuthType;
	profilePictureUrl: string | null;
	preferences?: {
		interests: {
			id: string;
			name: string;
			skills: {
				skillId: string;
				name: string;
				level: SkillLevel;
			}[];
		}[];
	};
}

export interface GetProfileOutput {
	profile: UserProfileDTO;
}

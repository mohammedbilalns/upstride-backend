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

import type {
	SkillLevel,
	UserRole,
} from "../../../domain/entities/user.entity";

export interface GetProfileInput {
	userId: string;
}

export interface UserProfileDTO {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole;
	profilePictureUrl: string | null;
	preferences?: {
		interests: {
			id: string;
			name: string;
		}[];
		skills: {
			skillId: string;
			name: string;
			interestId: string;
			level: SkillLevel;
		}[];
	};
}

export interface GetProfileOutput {
	profile: UserProfileDTO;
}

import type { SkillLevel } from "../../../../domain/entities/user.entity";

export interface UpdateProfileInput {
	userId: string;
	name?: string;
	profilePictureId?: string;
	interests?: string[];
	skills?: {
		skillId: string;
		level: SkillLevel;
	}[];
}

export interface UpdateProfileOutput {
	success: boolean;
	message: string;
}

import type { SkillLevel } from "../../../../../domain/entities/user.entity";
import type { LoginResponse } from "../login/login-with-email.dto";

export interface SaveUserInterestsInput {
	setupToken: string;
	interests: string[];
	skills: {
		skillId: string;
		level: SkillLevel;
	}[];
	deviceType?: string;
	deviceVendor?: string;
	deviceModel?: string;
	deviceOs?: string;
	ipAddress?: string;
	userAgent?: string;
	browser?: string;
}

export type SaveUserInterestsResponse = LoginResponse;

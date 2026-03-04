import type { SkillLevel } from "../../../domain/entities/user.entity";
import type { LoginResponse } from "./login.dto";

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
}

export type SaveUserInterestsResponse = LoginResponse;

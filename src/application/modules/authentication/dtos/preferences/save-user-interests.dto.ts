import type { LoginResponse } from "../login/login-with-email.dto";

export interface SaveUserInterestsInput {
	setupToken: string;
	interests: string[];
	skills: string[];
	deviceType?: string;
	deviceVendor?: string;
	deviceModel?: string;
	deviceOs?: string;
	ipAddress?: string;
	userAgent?: string;
	browser?: string;
}

export type SaveUserInterestsResponse = LoginResponse;

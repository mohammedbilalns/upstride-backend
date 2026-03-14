import type { UserRole } from "../../../../domain/entities/user.entity";

export interface LoginWithEmailInput {
	email: string;
	password: string;
	deviceType?: string;
	deviceVendor?: string;
	deviceModel?: string;
	deviceOs?: string;
	ipAddress?: string;
	userAgent?: string;
	browser?: string;
}

export interface AuthenticatedUserDTO {
	id: string;
	name: string;
	role: UserRole;
	profilePictureUrl: string | null;
	isLocalAuth: boolean;
}

export interface LoginResponse {
	user: AuthenticatedUserDTO;
	accessToken: string;
	refreshToken: string;
}

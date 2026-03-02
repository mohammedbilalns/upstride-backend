import type { UserRole } from "../../../domain/entities/user.entity";

export interface LoginWithEmailInput {
	email: string;
	password: string;
}

export interface AuthenticatedUserDTO {
	id: string;
	name: string;
	role: UserRole;
	profilePictureUrl: string | null;
}

export interface LoginResponse {
	user: AuthenticatedUserDTO;
	accessToken: string;
	refreshToken: string;
}

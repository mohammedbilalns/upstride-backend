import type { UserDTO } from "./user.dto";
export interface GoogleAuthRegisterResponse {
	token: string;
	email?: string;
}

export interface GoogleAuthLoginResponse {
	user: UserDTO;
	accessToken: string;
	refreshToken: string;
}

export type GoogleAuthResponse =
	| GoogleAuthRegisterResponse
	| GoogleAuthLoginResponse;

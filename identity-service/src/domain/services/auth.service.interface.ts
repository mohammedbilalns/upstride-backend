import type { GoogleAuthResponse, UserDTO } from "../../application/dtos";

export interface IAuthService {
	loginUser(
		email: string,
		password: string,
	): Promise<{ accessToken: string; refreshToken: string; user: UserDTO }>;
	refreshAccessToken(
		refreshToken: string,
	): Promise<{ accessToken: string; refreshToken: string }>;
	googleAuthenticate(token: string): Promise<GoogleAuthResponse>;
	isUserBlocked(userId: string): Promise<boolean>;
	getUser(userId: string): Promise<UserDTO>;
	logout(userId: string): Promise<void>;
}

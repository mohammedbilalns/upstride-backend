import type { UserDTO } from "../../application/dtos";

export interface IRegistrationService {
	registerUser(
		name: string,
		email: string,
		phone: string,
		password: string,
	): Promise<void>;
	verifyOtp(email: string, otp: string): Promise<string>;
	resendRegisterOtp(email: string): Promise<void>;
	createInterests(
		email: string,
		expertises: string[],
		skills: string[],
		token: string,
	): Promise<{ accessToken: string; refreshToken: string; user: UserDTO }>;
}

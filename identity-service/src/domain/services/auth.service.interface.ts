import { UserDTO } from "../../application/dtos/userDto";

export interface IAuthService {
  registerUser(name: string, email: string, password: string):Promise<void>;
	verifyOtp(email: string, otp: string): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }>;
  loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string, user: UserDTO }>;
  refreshAccessToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }>;
  googleAuthenticate(token: string): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }>;
  initiatePasswordReset(email: string): Promise<void>;
	verifyResetOtp(email: string, otp: string): Promise<void>;
  updatePassword(email: string, newPassword: string): Promise<void>;
}

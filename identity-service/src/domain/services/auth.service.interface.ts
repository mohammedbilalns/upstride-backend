import { UserDTO } from "../../application/dtos/userDto";

export interface IAuthService {
  registerUser(email: string, password: string, roles: ("user" | "professional" | "admin")[]): Promise<UserDTO>;
  loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string, user: UserDTO }>;
  refreshAccessToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }>;
  googleAuthenticate(token: string): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }>;
  initiatePasswordReset(email: string): Promise<void>;
  updatePassword(email: string, newPassword: string): Promise<void>;
}
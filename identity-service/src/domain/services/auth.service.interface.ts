import { UserDTO } from "../../application/dtos";

export interface IAuthService { 
  loginUser(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: UserDTO }>;
  refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  googleAuthenticate(
    token: string,
  ): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }>;
	isUserBlocked(userId: string): Promise<boolean>;

}

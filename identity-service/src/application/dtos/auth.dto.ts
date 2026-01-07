import { UserDTO } from "./user.dto";

export type LoginReturn = {
	accessToken: string;
	refreshToken: string;
	user: UserDTO;
};

export type GoogleAuthResponse =
	| { token: string; email: string }
	| { user: any; accessToken: string; refreshToken: string };

export type LoginUserDto = {
	email: string;
	password: string;
};

export type GoogleAuthDto = {
	token: string;
};

export type RefreshTokenDto = {
	refreshToken: string;
};

export type LogoutDto = {
	userId: string;
};

export type GetUserDto = {
	userId: string;
};

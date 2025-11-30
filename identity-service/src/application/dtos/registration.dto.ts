import { UserDTO } from "./user.dto";

export type createInterestsParam = {
	email: string;
	expertises: string[];
	skills: string[];
	token: string;
};

export type createInterestsReturn = {
	accessToken: string;
	refreshToken: string;
	user: UserDTO;
};

export type registerUserParam = {
	name: string;
	email: string;
	phone: string;
	password: string;
};

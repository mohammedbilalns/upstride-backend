import { UserDTO } from "./user.dto";

export type NewTopic = {
	name: string;
	expertiseId?: string;
	expertiseName?: string;
};

export type createInterestsParam = {
	email: string;
	expertises: string[];
	skills: string[];
	newExpertises?: string[];
	newTopics?: NewTopic[];
	token: string;
};

export type LoginReturn = {
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

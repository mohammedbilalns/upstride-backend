export type NewTopic = {
	name: string;
	expertiseId?: string;
	expertiseName?: string;
};

export type CreateInterestsDto = {
	email: string;
	expertises: string[];
	skills: string[];
	newExpertises?: string[];
	newTopics?: NewTopic[];
	token: string;
};

export type RegisterUserDto = {
	name: string;
	email: string;
	phone: string;
	password: string;
};

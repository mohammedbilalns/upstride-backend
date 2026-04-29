export interface AddSkillInput {
	name: string;
	interestId: string;
}

export interface AddSkillOutput {
	newSkillId: string;
	name: string;
	interestId: string;
	slug: string;
}

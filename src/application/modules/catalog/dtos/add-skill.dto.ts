export interface AddSkillInput {
	name: string;
	interestId: string;
}

export interface AddSkillOutput {
	newSkillId: string;
	interestId: string;
	slug: string;
}

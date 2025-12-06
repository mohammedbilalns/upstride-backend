export interface IExpertiseHelperService {
	processNewSkills(
		skillNames: string[],
		expertiseId: string,
	): Promise<string[]>;
}

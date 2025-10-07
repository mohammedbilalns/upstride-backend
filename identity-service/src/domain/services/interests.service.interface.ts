export interface IInterestsService {
	fetchInterests(
		userId: string,
	): Promise<{ expertises: string[]; skills: string[] }>;
}

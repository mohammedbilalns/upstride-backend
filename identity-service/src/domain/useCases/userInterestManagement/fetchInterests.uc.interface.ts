export interface IFetchInterestsUC {
	execute(userId: string): Promise<{ expertises: string[]; skills: string[] }>;
}

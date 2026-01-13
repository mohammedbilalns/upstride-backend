export interface IFetchMentorByExpertiseUC {
	execute(expertiseId: string): Promise<string[]>;
}

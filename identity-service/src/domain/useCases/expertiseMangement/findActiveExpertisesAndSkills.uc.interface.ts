export interface IFindActiveExpertisesAndSkillsUC {
	execute(): Promise<{ expertises: string[]; skills: string[] }>;
}

export interface ILogoutUC {
	execute(userId: string): Promise<void>;
}

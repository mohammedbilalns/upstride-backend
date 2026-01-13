export interface IInitiatePasswordResetUC {
	execute(email: string): Promise<void>;
}

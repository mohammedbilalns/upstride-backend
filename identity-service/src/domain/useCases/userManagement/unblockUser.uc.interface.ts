export interface IUnblockUserUC {
	execute(userId: string): Promise<void>;
}

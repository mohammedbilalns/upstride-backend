export interface IBlockUserUC {
	execute(userId: string): Promise<void>;
}

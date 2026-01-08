export interface IConfirmSessionUC {
	execute(transactionId: string): Promise<void>;
}

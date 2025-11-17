export interface IMarkMessageAsReadUC {
	execute(userId: string, messageId: string): Promise<void>;
}

export interface IMarkChatMessagesAsReadUC {
	execute(userId: string, senderId: string): Promise<void>;
}

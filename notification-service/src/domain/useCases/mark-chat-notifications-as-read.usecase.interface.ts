export interface IMarkChatNotificationsAsReadUC {
	execute(userId: string, chatId: string): Promise<void>;
}

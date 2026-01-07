import type { Message } from "../entities/message.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IMessageRepository extends IBaseRepository<Message> {
	getChatMessages(
		chatId: string,
		page: number,
		limit: number,
	): Promise<{ messages: Message[]; total: number }>;
	markMessagesAsRead(
		messageId: string,
		chatId: string,
		senderId: string,
	): Promise<void>;
	markAllMessagesAsRead(
		chatId: string,
		receiverId: string,
		senderId: string,
	): Promise<void>;
}

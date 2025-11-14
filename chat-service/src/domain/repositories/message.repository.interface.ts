import { Message } from "../entities/message.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IMessageRepository extends IBaseRepository<Message> {
	getChatMessages(
		chatId: string,
		page: number,
		limit: number,
	): Promise<{ messages: Message[]; total: number }>;
  markMessagesAsRead(messageId: string, chatId: string, senderId: string): Promise<void>;

}

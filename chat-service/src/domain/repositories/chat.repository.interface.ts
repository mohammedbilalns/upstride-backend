import type { Chat } from "../entities/chat.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IChatRepository extends IBaseRepository<Chat> {
	getChatByUserIds(userIds: string[]): Promise<Chat | null>;
	getUserChats(
		userId: string,
		page: number,
		limit: number,
	): Promise<{ chats: Chat[]; total: number }>;
}

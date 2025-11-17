import { Chat } from "../../domain/entities";

export interface getChatsDto {
	userId: string;
	page: number;
	limit: number;
}

export interface getChatsResult {
	chats: (Omit<Chat, "unreadCount"> & { unreadCount: number })[];
	total: number;
}

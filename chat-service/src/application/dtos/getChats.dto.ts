import type { Chat } from "../../domain/entities";

export interface GetChatsDto {
	userId: string;
	page: number;
	limit: number;
}

export interface GetChatsResult {
	chats: (Omit<Chat, "unreadCount"> & { unreadCount: number })[];
	total: number;
}

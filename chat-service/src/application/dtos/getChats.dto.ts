import { Chat } from "../../domain/entities";

export interface getChatsDto {
	userId: string;
	page: number;
	limit: number;
}

export interface getChatsResult {
	chats: Chat[];
	total: number;
}

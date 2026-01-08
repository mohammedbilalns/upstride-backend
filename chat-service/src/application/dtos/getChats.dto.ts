import type { Chat } from "../../domain/entities";

export interface GetChatsDto {
	userId: string;
	page: number;
	limit: number;
}

export interface GetChatsResult {
	chats: (Omit<Chat, "unreadCount"> & {
		unreadCount: number;
		participant: {
			id: string;
			name: string;
			profilePicture?: string;
			isMentor: boolean;
			mentorId?: string;
		} | null;
	})[];
	total: number;
}

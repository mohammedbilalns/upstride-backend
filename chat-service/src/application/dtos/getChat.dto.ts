import type { Message } from "../../domain/entities/message.entity";

export interface GetChatDto {
	userIds: string[];
	currentUserId: string;
	page: number;
	limit: number;
}

export interface GetChatResult {
	chat: {
		id: string;
		participant: {
			id: string;
			name: string;
			profilePicture?: string;
		};
	};
	messages: Message[];
	total: number;
}

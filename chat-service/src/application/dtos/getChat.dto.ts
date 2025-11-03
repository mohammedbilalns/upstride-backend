import { Message } from "../../domain/entities/message.entity";

export interface getChatDto {
	userIds: string[];
	currentUserId: string;
	page: number;
	limit: number;
}

export interface getChatResult {
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

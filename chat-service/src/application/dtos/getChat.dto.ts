import { Message } from "../../domain/entities/message.entity";

export interface getChatDto {
	userIds: string[];
	page: number;
	limit: number;
}

export interface getChatResult {
	messages: Message[];
	total: number;
}

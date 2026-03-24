import type {
	MessageStatus,
	MessageType,
} from "../../../../domain/entities/chat-message.entity";

export interface ChatDto {
	id: string;
	senderId: string;
	receiverId: string;
	sender: ChatUserDto;
	receiver: ChatUserDto;
	lastMessageId: string | null;
	lastMessage: ChatLastMessageDto | null;
	unreadCount: Record<string, number>;
	createdAt: Date;
	updatedAt: Date;
}

export interface ChatUserDto {
	id: string;
	name: string;
	profilePictureUrl?: string | null;
}

export interface ChatLastMessageDto {
	id: string;
	senderId: string;
	messageType: "TEXT" | "IMAGE" | "FILE";
	content: string | null;
	mediaId: string | null;
	createdAt: Date;
}

export interface ChatMessageDto {
	id: string;
	chatId: string;
	senderId: string;
	messageType: MessageType;
	content: string | null;
	attachementId: string | null;
	mediaUrl: string | null;
	repliedTo: string | null;
	status: MessageStatus;
	createdAt: Date;
	updatedAt: Date;
}

export type ChatReadFilter = "read" | "unread" | "all";

export interface GetChatsInput {
	userId: string;
	page?: number;
	filter?: ChatReadFilter;
}

export interface GetChatsOutput {
	chats: ChatDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetChatInput {
	userId: string;
	otherUserId: string;
	page?: number;
}

export interface GetChatOutput {
	chat: ChatDto | null;
	messages: ChatMessageDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateChatInput {
	userId: string;
	otherUserId: string;
}

export interface CreateChatOutput {
	chat: ChatDto;
}

export interface SendMessageInput {
	chatId: string;
	senderId: string;
	content?: string | null;
	mediaId?: string | null;
	messageType?: "TEXT" | "IMAGE" | "FILE";
	repliedTo?: string | null;
}

export interface SendMessageOutput {
	message: ChatMessageDto;
}

export interface MarkMessagesReadInput {
	chatId: string;
	readerId: string;
}

export interface MarkMessagesReadOutput {
	updatedCount: number;
}

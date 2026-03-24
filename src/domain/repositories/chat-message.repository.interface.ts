import type {
	Chatmessage,
	MessageStatus,
} from "../entities/chat-message.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ChatMessageQuery {
	chatId?: string;
	senderId?: string;
	status?: MessageStatus;
}

export interface IChatMessageRepository
	extends CreatableRepository<Chatmessage>,
		FindByIdRepository<Chatmessage>,
		QueryableRepository<Chatmessage, ChatMessageQuery>,
		PaginatableRepository<Chatmessage, ChatMessageQuery>,
		UpdatableByIdRepository<Chatmessage> {
	markAsRead(chatId: string, readerId: string): Promise<number>;
}

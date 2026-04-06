import type { Chat } from "../entities/chat.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ChatUserSummary {
	id: string;
	name: string;
	profilePictureId?: string | null;
}

export interface IChatRepository
	extends CreatableRepository<Chat>,
		FindByIdRepository<Chat>,
		UpdatableByIdRepository<Chat> {
	findByUserId(userId: string): Promise<Chat[]>;
	findByParticipants(user1Id: string, user2Id: string): Promise<Chat | null>;
	findByParticipantsWithUsers(
		user1Id: string,
		user2Id: string,
	): Promise<{ chat: Chat | null; users: ChatUserSummary[] }>;
	paginateByUserWithUsers(
		userId: string,
		filter: "read" | "unread" | "all",
		page: number,
		limit: number,
	): Promise<{
		items: Chat[];
		users: ChatUserSummary[];
		lastMessages: Record<
			string,
			{
				id: string;
				senderId: string;
				messageType: "TEXT" | "IMAGE" | "FILE";
				content: string | null;
				mediaId: string | null;
				createdAt: Date;
			}
		>;
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
}

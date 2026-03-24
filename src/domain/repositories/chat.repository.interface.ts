import type { Chat } from "../entities/chat.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface IChatRepository
	extends CreatableRepository<Chat>,
		FindByIdRepository<Chat>,
		UpdatableByIdRepository<Chat> {
	findByUserId(userId: string): Promise<Chat[]>;
	findByParticipants(user1Id: string, user2Id: string): Promise<Chat | null>;
	paginateByUser(
		userId: string,
		filter: "read" | "unread" | "all",
		page: number,
		limit: number,
	): Promise<{
		items: Chat[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
}

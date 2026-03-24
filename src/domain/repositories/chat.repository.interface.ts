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
}

import { Chat } from "../entities/chat.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IChatRepository extends IBaseRepository<Chat> {
	// getChatsByUserId(userId: string, page : number, limit: number): Promise<void>
}

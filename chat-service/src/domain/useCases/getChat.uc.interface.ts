import { Message } from "../entities/message.entity";

export interface IGetChatUC {
	execute(userIds: string[], page: number, limit: number): Promise<Message[]>;
}

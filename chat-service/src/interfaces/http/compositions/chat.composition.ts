import { GetChatUC } from "../../../application/usecases/getChat.uc";
import { GetChatsUC } from "../../../application/usecases/getChats.uc";
import {
	IChatRepository,
	IMessageRepository,
} from "../../../domain/repositories";
import { IGetChatUC } from "../../../domain/useCases/getChat.uc.interface";
import { IGetChatsUC } from "../../../domain/useCases/getChats.uc.interface";
import { ChatRepository } from "../../../infrastructure/database/repositories/chat.repository";
import { MessageRepository } from "../../../infrastructure/database/repositories/message.repository";
import { ChatController } from "../controllers/chat.controller";

export function createChatController(): ChatController {
	const chatRepository: IChatRepository = new ChatRepository();
	const messageRepository: IMessageRepository = new MessageRepository();

	const getChatsUC: IGetChatsUC = new GetChatsUC(chatRepository);
	const getChatUC: IGetChatUC = new GetChatUC(
		chatRepository,
		messageRepository,
	);
	return new ChatController(getChatsUC, getChatUC);
}

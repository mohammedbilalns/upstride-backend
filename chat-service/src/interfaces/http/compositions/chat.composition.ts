import { CacheService } from "../../../application/services/cache.service";
import { GetChatUC } from "../../../application/usecases/getChat.uc";
import { GetChatsUC } from "../../../application/usecases/getChats.uc";
import {
	IChatRepository,
	IMessageRepository,
} from "../../../domain/repositories";
import { ICacheService } from "../../../domain/services/cache.service.interface";
import { IUserService } from "../../../domain/services/user.service.interface";
import { IGetChatUC } from "../../../domain/useCases/getChat.uc.interface";
import { IGetChatsUC } from "../../../domain/useCases/getChats.uc.interface";
import { ChatRepository } from "../../../infrastructure/database/repositories/chat.repository";
import { MessageRepository } from "../../../infrastructure/database/repositories/message.repository";
import { UserService } from "../../../infrastructure/external/user.service";
import { ChatController } from "../controllers/chat.controller";
import { redisClient } from "../../../infrastructure/config";

export function createChatController(): ChatController {
	const chatRepository: IChatRepository = new ChatRepository();
	const messageRepository: IMessageRepository = new MessageRepository();
	const cacheService: ICacheService = new CacheService(redisClient);
	const userService: IUserService = new UserService(cacheService);

	const getChatsUC: IGetChatsUC = new GetChatsUC(chatRepository, userService);
	const getChatUC: IGetChatUC = new GetChatUC(
		chatRepository,
		messageRepository,
		userService,
	);
	return new ChatController(getChatsUC, getChatUC);
}

import { CacheService } from "../../../application/services/cache.service";
import { GetChatUC } from "../../../application/usecases/get-chat.uc";
import { GetChatsUC } from "../../../application/usecases/get-chats.uc";
import type {
	IChatRepository,
	IMessageRepository,
} from "../../../domain/repositories";
import type { ICacheService } from "../../../domain/services/cache.service.interface";
import type { IUserService } from "../../../domain/services/user.service.interface";
import type { IGetChatUC } from "../../../domain/useCases/get-chat.uc.interface";
import type { IGetChatsUC } from "../../../domain/useCases/get-chats.uc.interface";
import { redisClient } from "../../../infrastructure/config";
import { ChatRepository } from "../../../infrastructure/database/repositories/chat.repository";
import { MessageRepository } from "../../../infrastructure/database/repositories/message.repository";
import { UserService } from "../../../infrastructure/external/user.service";
import { ChatController } from "../controllers/chat.controller";

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

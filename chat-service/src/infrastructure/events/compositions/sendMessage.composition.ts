import { CacheService } from "../../../application/services/cache.service";
import { SendMessageUC } from "../../../application/usecases/sendMessage.uc";
import { redisClient } from "../../config";
import { ChatRepository } from "../../database/repositories/chat.repository";
import { MessageRepository } from "../../database/repositories/message.repository";
import { UserService } from "../../external/user.service";
import { createSaveMessageConsumer } from "../consumers/saveMessage.consumer";
import EventBus from "../eventBus";

export async function composeSendMessageConsumer() {
	const messageRepository = new MessageRepository();
	const chatRepository = new ChatRepository();
	const cacheService = new CacheService(redisClient);
	const userService = new UserService(cacheService);

	const sendMessageUsecase = new SendMessageUC(
		messageRepository,
		chatRepository,
		EventBus,
		userService,
	);

	await createSaveMessageConsumer(sendMessageUsecase);
}

import { MarkChatMessagesAsReadUC } from "../../../application/usecases/markChatMessagesAsRead.uc";
import { ChatRepository } from "../../database/repositories/chat.repository";
import { MessageRepository } from "../../database/repositories/message.repository";
import { createMarkChatReadConsumer } from "../consumers/markChatRead.consumer";
import EventBus from "../eventBus";

export async function composeMarkChatReadConsumer() {
	const messageRepository = new MessageRepository();
	const chatRepository = new ChatRepository();

	const markChatReadUsecase = new MarkChatMessagesAsReadUC(
		chatRepository,
		messageRepository,
		EventBus,
	);
	await createMarkChatReadConsumer(markChatReadUsecase);
}

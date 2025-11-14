import { MarkMessageAsReadUC } from "../../../application/usecases/markMessageAsRead.uc";
import { ChatRepository } from "../../database/repositories/chat.repository";
import { MessageRepository } from "../../database/repositories/message.repository";
import { createMarkMessageReadConsumer } from "../consumers/markMessageRead.consumer";
import EventBus from "../eventBus";


export async function composeMarkMessageReadConsumer(){
  const messageRepository = new MessageRepository()
  const chatRepository  = new ChatRepository()
  
  const markMessageReadUsecase = new MarkMessageAsReadUC(messageRepository,chatRepository, EventBus)
  await createMarkMessageReadConsumer(markMessageReadUsecase)
}

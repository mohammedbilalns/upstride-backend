import { QueueEvents } from "../../../common/enums/queueEvents";
import { ISendMessageUC } from "../../../domain/useCases/sendMessage.uc.interface";
import logger from "../../../utils/logger";
import EventBus from "../eventBus";
import {
	MessagePayload,
	messageSchema,
} from "../validations/message.validation";

export async function createSaveMessageConsumer(sendMessageUC: ISendMessageUC) {
	await EventBus.subscribe<MessagePayload>(
		QueueEvents.SEND_MESSAGE,
		async (payload) => {
			try {
        logger.debug(`queue message payload : ${JSON.stringify(payload)}`)
				const messageData = messageSchema.parse(payload);
				await sendMessageUC.execute(messageData);
			} catch (err) {
				logger.error("Error saving chat message ", err);
        logger.error("Error stack", err.stack)
        
			}
		},
	);
}

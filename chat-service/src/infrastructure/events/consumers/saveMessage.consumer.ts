import { QueueEvents } from "../../../common/enums/queueEvents";
import logger from "../../../common/utils/logger";
import type { ISendMessageUC } from "../../../domain/useCases/sendMessage.uc.interface";
import EventBus from "../eventBus";
import {
	type MessagePayload,
	messageSchema,
} from "../validations/message.validation";

export async function createSaveMessageConsumer(sendMessageUC: ISendMessageUC) {
	await EventBus.subscribe<MessagePayload>(
		QueueEvents.SEND_MESSAGE,
		async (payload) => {
			try {
				const messageData = messageSchema.parse(payload);
				await sendMessageUC.execute(messageData);
			} catch (err) {
				logger.error(`Error saving chat message ${err}`);
			}
		},
	);
}

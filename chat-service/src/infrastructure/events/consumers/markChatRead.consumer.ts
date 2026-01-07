import type { MarkChatMessagesAsReadUC } from "../../../application/usecases/markChatMessagesAsRead.uc";
import { QueueEvents } from "../../../common/enums/queueEvents";
import logger from "../../../common/utils/logger";
import EventBus from "../eventBus";
import {
	type MarkChatReadDataPayload,
	markChatReadDataSchema,
} from "../validations/markChatReadData.validation";

export async function createMarkChatReadConsumer(
	markChatReadUc: MarkChatMessagesAsReadUC,
) {
	await EventBus.subscribe<MarkChatReadDataPayload>(
		QueueEvents.MARK_CHAT_READ,
		async (payload) => {
			try {
				const markChatData = markChatReadDataSchema.parse(payload);
				await markChatReadUc.execute(
					markChatData.userId,
					markChatData.senderId,
				);
			} catch (err) {
				logger.error(`Error marking chat as read: ${err.message}`);
				// logger.error(`Error marking chat as read: ${err.stack}`);
			}
		},
	);
}

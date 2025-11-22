import type { MarkMessageAsReadUC } from "../../../application/usecases/markMessageAsRead.uc";
import { QueueEvents } from "../../../common/enums/queueEvents";
import logger from "../../../common/utils/logger";
import EventBus from "../eventBus";
import {
	type MarkMessageDataPayload,
	markMessageDataSchema,
} from "../validations/markMessageData.validation";

export async function createMarkMessageReadConsumer(
	markMessageReadUc: MarkMessageAsReadUC,
) {
	await EventBus.subscribe<MarkMessageDataPayload>(
		QueueEvents.MARK_MESSAGE_READ,
		async (payload) => {
			try {
				const markMessageData = markMessageDataSchema.parse(payload);
				await markMessageReadUc.execute(
					markMessageData.userId,
					markMessageData.messageId,
				);
			} catch (err) {
				logger.error(`Error marking message as read: ${err.message}`);
				logger.error(`Error marking message as read: ${err.stack}`);
			}
		},
	);
}

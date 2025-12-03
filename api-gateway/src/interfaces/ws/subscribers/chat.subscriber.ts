import { QueueEvents } from "../../../common/enums/queueEvents";
import { SocketEvents } from "../../../common/enums/socketEvents";
import type { IEventBus } from "../../../domain/events/eventBus.interface";
import logger from "../../../utils/logger";
import type { SocketPublisher } from "../socket.publisher";
import {
	messagePayloadSchema,
	messageStatusPayloadSchema,
} from "../validations/messagePayload.validation";

export async function registerChatSubscriber(
	eventBus: IEventBus,
	socketPublisher: SocketPublisher,
) {
	await eventBus.subscribe(QueueEvents.SAVED_MESSAGE, async (payload) => {
		try {
			const parsedPayload = messagePayloadSchema.parse(payload);
			socketPublisher.emitToUser(
				parsedPayload.receiverId,
				SocketEvents.SEND_MESSAGE,
				parsedPayload,
			);

			logger.info("[WS] Message delivered via Socket.IO");
		} catch (error) {
			logger.error(`[WS] Failed to emit message: ${error}`);
		}
	});

	await eventBus.subscribe(QueueEvents.MARKED_MESSAGE_READ, async (payload) => {
		try {
			const parsedPayload = messageStatusPayloadSchema.parse(payload);
			socketPublisher.emitToUser(
				parsedPayload.senderId,
				SocketEvents.MARK_MESSAGE_READ,
				{ recieverId: parsedPayload.recieverId },
			);
		} catch (error) {
			logger.error(`Error updating read status: ${error}`);
		}
	});
}

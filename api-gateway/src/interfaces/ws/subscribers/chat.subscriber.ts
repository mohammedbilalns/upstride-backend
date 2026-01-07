import { QueueEvents } from "../../../common/enums/queueEvents";
import { SocketEvents } from "../../../common/enums/socketEvents";
import type { IEventBus } from "../../../domain/events/eventBus.interface";
import logger from "../../../utils/logger";
import type { SocketPublisher } from "../socket.publisher";
import { messagePayloadSchema } from "../validations/messagePayload.validation";

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

	await eventBus.subscribe(QueueEvents.MARKED_CHAT_READ, async (payload) => {
		try {
			const { senderId, recieverId } = payload as any; // or define schema
			socketPublisher.emitToUser(senderId, SocketEvents.MARK_CHAT_READ, {
				recieverId,
			});
		} catch (error) {
			logger.error(`Error updating chat read status: ${error}`);
		}
	});
}

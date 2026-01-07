import type { Socket } from "socket.io";
import { QueueEvents } from "../../../common/enums/queueEvents";
import { SocketEvents } from "../../../common/enums/socketEvents";
import logger from "../../../utils/logger";
import type { SocketPublisher } from "../socket.publisher";
import { clientMessageSchema } from "../validations/messagePayload.validation";

export function registerChatEvents(socket: Socket, publisher: SocketPublisher) {
	socket.on(SocketEvents.SEND_MESSAGE, async (data) => {
		try {
			logger.debug(`clientMessage ${JSON.stringify(data)}`);
			const parsedData = clientMessageSchema.parse(data);

			const payload = {
				...parsedData,
				from: socket.data.user.id,
			};
			logger.info(
				`[WS] Received message from user ${payload.from} -> ${payload.to}`,
			);

			await publisher.publishToQueue(QueueEvents.SEND_MESSAGE, payload);

			publisher.emitToUser(payload.from, SocketEvents.SEND_MESSAGE, {
				status: "pending",
				...payload,
			});
		} catch (error) {
			logger.error(`Error sending message ${error}`);
		}
	});

	socket.on(SocketEvents.MARK_CHAT_READ, async (data) => {
		try {
			const userId = socket.data.user.id;
			if (!data.senderId) return;

			await publisher.publishToQueue(QueueEvents.MARK_CHAT_READ, {
				userId,
				senderId: data.senderId,
			});
		} catch (error) {
			logger.error("Error marking chat read", error);
		}
	});
}

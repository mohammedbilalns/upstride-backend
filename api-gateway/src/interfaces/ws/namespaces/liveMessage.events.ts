import type { Socket } from "socket.io";
import { QueueEvents } from "../../../common/enums/queueEvents";
import { SocketEvents } from "../../../common/enums/socketEvents";
import logger from "../../../utils/logger";
import type { SocketPublisher } from "../socket.publisher";

export function registerLiveMessageEvents(
	socket: Socket,
	publisher: SocketPublisher,
) {
	socket.on(SocketEvents.LIVE_SESSION_MESSAGE, async (data) => {
		try {
			logger.info(`[WS] Received live message: ${JSON.stringify(data)}`);

			publisher.publishToQueue(QueueEvents.LIVE_SESSION_MESSAGE, {
				...data,
				from: socket.data.user.id,
			});

			if (data.roomId) {
				socket.to(data.roomId).emit(SocketEvents.LIVE_SESSION_MESSAGE, {
					...data,
					senderId: socket.data.user.id,
				});
			}
		} catch (error) {
			logger.error(`Error processing live message ${error}`);
		}
	});
}

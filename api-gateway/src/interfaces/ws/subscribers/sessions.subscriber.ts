import { QueueEvents } from "../../../common/enums/queueEvents";
import { SocketEvents } from "../../../common/enums/socketEvents";
import type { IEventBus } from "../../../domain/events/eventBus.interface";
import logger from "../../../utils/logger";
import type { SocketPublisher } from "../socket.publisher";

export function registerSessionSubscriber(
	eventBus: IEventBus,
	publisher: SocketPublisher,
) {
	eventBus.subscribe(QueueEvents.SESSION_BOOKED, async (data: any) => {
		logger.info(`[WS] Received session booked event: ${JSON.stringify(data)}`);

		// Notify the Mentor
		if (data.mentorId) {
			publisher.emitToUser(data.mentorId, SocketEvents.NEW_NOTIFICATION, {
				type: "SESSION_BOOKED",
				message: "You have a new session booking!",
				data: data,
			});
		}

		// Notify the User (Participant)
		if (data.userId) {
			publisher.emitToUser(data.userId, SocketEvents.NEW_NOTIFICATION, {
				type: "SESSION_CONFIRMED",
				message: "Your session has been confirmed!",
				data: data,
			});
		}
	});

	eventBus.subscribe(QueueEvents.PAYMENT_COMPLETED, async (data: any) => {
		logger.info(
			`[WS] Received payment completed event: ${JSON.stringify(data)}`,
		);
		// Optionally notify user of payment success via socket if strictly needed,
		// but SESSION_BOOKED (confirmed) is usually sufficient.
	});
}

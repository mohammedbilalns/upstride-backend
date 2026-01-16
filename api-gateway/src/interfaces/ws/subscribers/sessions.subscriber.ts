import { QueueEvents } from "../../../common/enums/queue-events";
import { SocketEvents } from "../../../common/enums/socket-events";
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
	});

	eventBus.subscribe(QueueEvents.STARTED_SESSION, async (data: any) => {
		logger.info(`[WS] Received session started event: ${JSON.stringify(data)}`);
		// Notify Mentor and User to join the session
		const payload = {
			sessionId: data.sessionId,
			mentorId: data.mentorId,
			userId: data.userId,
		};
		// Custom event 'session_started' to trigger navigation or modal
		publisher.emitToUser(data.mentorId, "session_started", payload);
		publisher.emitToUser(data.userId, "session_started", payload);
	});
}

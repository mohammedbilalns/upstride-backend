import { QueueEvents } from "../../../common/enums/queue-events";
import { SocketEvents } from "../../../common/enums/socket-events";
import type { IEventBus } from "../../../domain/events/eventBus.interface";
import logger from "../../../utils/logger";
import type { SocketPublisher } from "../socket.publisher";
import { notificationValidationSchema } from "../validations/notification.validation";

export async function registerNotificationSubscriber(
	eventBus: IEventBus,
	socketPublisher: SocketPublisher,
) {
	await eventBus.subscribe(
		QueueEvents.NOTIFICATION_CREATED,
		async (payload) => {
			try {
				const { userId, ...notificationData } =
					notificationValidationSchema.parse(payload);
				socketPublisher.emitToUser(
					userId,
					SocketEvents.NEW_NOTIFICATION,
					notificationData,
				);
				logger.info("[WS] sent notification to the client");
			} catch (error) {
				logger.error("Error sending notification to the client", error);
			}
		},
	);
}

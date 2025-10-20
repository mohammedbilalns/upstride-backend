import { QueueEvents } from "../../../common/enums/queueEvents";
import { IEventBus } from "../../../domain/events/eventBus.interface";
import { notificationValidationSchema } from "../validations/notification.validation";
import logger from "../../../utils/logger";
import { SocketPublisher } from "../socket.publisher";
import { SocketEvents } from "../../../common/enums/socketEvents";

export async function registerNotificationSubscriber(eventBus: IEventBus, socketPublisher: SocketPublisher){

	await eventBus.subscribe(
		QueueEvents.NOTIFICATION_CREATED,
		async (payload) => {
			try {

				const {userId,...notificationData} = notificationValidationSchema.parse(payload);
				socketPublisher.emitToUser(userId, SocketEvents.NEW_NOTIFICATION, notificationData)
				logger.info("[WS] sent notification to the client");

			}catch(error){
				logger.error("Error sending notification to the client")
			}
		}
	)

}

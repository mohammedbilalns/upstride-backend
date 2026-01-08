import { IEventBus } from "../../../domain/events/IEventBus";
import logger from "../../../common/utils/logger";

interface SessionBookedPayload {
	bookingId: string;
	paymentId: string;
	userId: string;
	mentorId: string;
}

export async function sessionBookedConsumer(
	data: SessionBookedPayload,
	_eventBus: IEventBus,
) {
	try {
		logger.info(
			`[NotificationService] Processing session booked: ${JSON.stringify(data)}`,
		);
	} catch (error: any) {
		logger.error(
			`Error processing session booked notification: ${error.message}`,
		);
	}
}

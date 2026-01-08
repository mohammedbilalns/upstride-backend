import { QueueEvents } from "../../../common/enums/queueEvents";
import logger from "../../../common/utils/logger";
import { IConfirmSessionUC } from "../../../domain/useCases/bookings/confirmSession.uc.interface";
import EventBus from "../eventBus";

interface PaymentVerifiedPayload {
	orderId: string;
	paymentId: string;
}

export async function createPaymentVerifiedConsumer(
	confirmSessionUC: IConfirmSessionUC,
) {
	await EventBus.subscribe<PaymentVerifiedPayload>(
		QueueEvents.PAYMENT_COMPLETED,
		async (payload) => {
			try {
				await confirmSessionUC.execute(payload.orderId, payload.paymentId);
			} catch (err) {
				logger.error(
					`Error confirming session for payment ${payload.orderId}: ${err}`,
				);
			}
		},
	);
}

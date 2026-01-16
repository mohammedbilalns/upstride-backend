import { QueueEvents } from "../../../common/enums/queue-events";
import logger from "../../../common/utils/logger";
import { IConfirmSessionUC } from "../../../domain/useCases/bookings/confirm-session.uc.interface";
import EventBus from "../eventBus";
import { z } from "zod";

const paymentVerifiedSchema = z.object({
	orderId: z.string().min(1),
	paymentId: z.string().min(1),
});

type PaymentVerifiedPayload = z.infer<typeof paymentVerifiedSchema>;

export async function createPaymentVerifiedConsumer(
	confirmSessionUC: IConfirmSessionUC,
) {
	await EventBus.subscribe<PaymentVerifiedPayload>(
		QueueEvents.PAYMENT_COMPLETED,
		async (payload) => {
			try {
				logger.info(`Checking payload schema for confirmation: ${JSON.stringify(payload)}`);
				const validatedPayload = paymentVerifiedSchema.parse(payload);
				await confirmSessionUC.execute(validatedPayload.orderId, validatedPayload.paymentId);
			} catch (err) {
				logger.error(
					`Error confirming session for payment. Payload: ${JSON.stringify(payload)}. Error: ${err}`,
				);
			}
		},
	);
}

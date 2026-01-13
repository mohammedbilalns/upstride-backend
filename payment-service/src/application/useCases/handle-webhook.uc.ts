import { WebhookEventDto } from "../../application/dtos/payment.dto";
import logger from "../../common/utils/logger";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { IHandleWebhookUC } from "../../domain/useCases/handle-webhook.usecase.interface";

export class HandleWebhookUC implements IHandleWebhookUC {
	constructor(private _paymentRepository: IPaymentRepository) {}

	async execute(event: WebhookEventDto) {
		const eventType = event.event_type;
		const resource = event.resource;

		if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
			const orderId = resource.supplementary_data?.related_ids?.order_id;

			if (orderId) {
				const payment =
					await this._paymentRepository.findByTransactionId(orderId);
				if (payment && payment.status !== "COMPLETED") {
					await this._paymentRepository.updateStatus(payment.id, "COMPLETED");
					logger.info(`Payment ${payment.id} completed via Webhook`);
				}
			}
		}
	}
}

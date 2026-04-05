import { inject, injectable } from "inversify";
import { CheckoutCompletedEvent } from "../../../../domain/events/checkout-completed.event";
import { CheckoutExpiredEvent } from "../../../../domain/events/checkout-expired.event";
import { CheckoutFailedEvent } from "../../../../domain/events/checkout-failed.event";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import type { IEventBus } from "../../../events/app-event-bus.interface";
import type { PaymentWebhookEvent } from "../../../services/payment-webhook.parser.interface";
import type { IProcessPaymentEventUseCase } from "./process-payment-event.usecase.interface";

@injectable()
export class ProcessPaymentEventUseCase implements IProcessPaymentEventUseCase {
	constructor(
		@inject(TYPES.Services.AppEventBus)
		private readonly _eventBus: IEventBus,
	) {}

	async execute(event: PaymentWebhookEvent): Promise<void> {
		switch (event.type) {
			case "checkout.session.completed":
				await this._eventBus.publish(new CheckoutCompletedEvent(event), {
					durable: true,
				});
				break;
			case "checkout.session.expired":
				await this._eventBus.publish(new CheckoutExpiredEvent(event), {
					durable: true,
				});
				break;
			case "checkout.session.async_payment_failed":
				await this._eventBus.publish(new CheckoutFailedEvent(event), {
					durable: true,
				});
				break;
			default:
				logger.warn(
					{ type: event.type },
					"Unhandled payment webhook event type",
				);
				break;
		}
	}
}

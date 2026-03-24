import { inject, injectable } from "inversify";
import { CheckoutCompletedEvent } from "../../../../domain/events/checkout-completed.event";
import { CheckoutExpiredEvent } from "../../../../domain/events/checkout-expired.event";
import { CheckoutFailedEvent } from "../../../../domain/events/checkout-failed.event";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import type { EventBus } from "../../../events/event-bus.interface";
import type { PaymentWebhookEvent } from "../../../services/payment-webhook.parser.interface";
import type { IProcessPaymentEventUseCase } from "./process-payment-event.usecase.interface";

@injectable()
export class ProcessPaymentEventUseCase implements IProcessPaymentEventUseCase {
	constructor(
		@inject(TYPES.Services.EventBus)
		private readonly _eventBus: EventBus,
	) {}

	async execute(event: PaymentWebhookEvent): Promise<void> {
		switch (event.type) {
			case "checkout.session.completed":
				await this._eventBus.publish(new CheckoutCompletedEvent(event));
				break;
			case "checkout.session.expired":
				await this._eventBus.publish(new CheckoutExpiredEvent(event));
				break;
			case "checkout.session.async_payment_failed":
				await this._eventBus.publish(new CheckoutFailedEvent(event));
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

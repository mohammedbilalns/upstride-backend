import { DomainEvent } from "./domain-event";
import type { PaymentEventPayload } from "./payment-event-payload";

export class CheckoutFailedEvent extends DomainEvent {
	readonly eventName = "checkout.failed";

	constructor(public readonly payload: PaymentEventPayload) {
		super();
	}
}

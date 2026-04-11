import { DomainEvent } from "./domain-event";
import type { PaymentEventPayload } from "./payment-event-payload";

export class CheckoutExpiredEvent extends DomainEvent {
	readonly eventName = "checkout.expired";

	constructor(public readonly payload: PaymentEventPayload) {
		super();
	}
}

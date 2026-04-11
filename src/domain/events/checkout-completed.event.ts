import { DomainEvent } from "./domain-event";
import type { PaymentEventPayload } from "./payment-event-payload";

export class CheckoutCompletedEvent extends DomainEvent {
	readonly eventName = "checkout.completed";

	constructor(public readonly payload: PaymentEventPayload) {
		super();
	}
}

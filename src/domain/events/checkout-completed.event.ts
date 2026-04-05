import { AppEvent } from "./app-event";
import type { PaymentEventPayload } from "./payment-event-payload";

export class CheckoutCompletedEvent extends AppEvent {
	readonly eventName = "checkout.completed";

	constructor(public readonly payload: PaymentEventPayload) {
		super();
	}
}

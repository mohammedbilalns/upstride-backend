import { AppEvent } from "./app-event";
import type { PaymentEventPayload } from "./payment-event-payload";

export class CheckoutFailedEvent extends AppEvent {
	readonly eventName = "checkout.failed";

	constructor(public readonly payload: PaymentEventPayload) {
		super();
	}
}

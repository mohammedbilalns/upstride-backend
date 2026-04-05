import { AppEvent } from "./app-event";
import type { PaymentEventPayload } from "./payment-event-payload";

export class CheckoutExpiredEvent extends AppEvent {
	readonly eventName = "checkout.expired";

	constructor(public readonly payload: PaymentEventPayload) {
		super();
	}
}

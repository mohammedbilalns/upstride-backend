import type { PaymentWebhookEvent } from "../../application/services/payment-webhook.parser.interface";
import { AppEvent } from "./domain-event";

export class CheckoutCompletedEvent extends AppEvent {
	constructor(public readonly payload: PaymentWebhookEvent) {
		super();
	}
}

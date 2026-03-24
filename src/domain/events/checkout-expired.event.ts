import type { PaymentWebhookEvent } from "../../application/services/payment-webhook.parser.interface";
import { AppEvent } from "./domain-event";

export class CheckoutExpiredEvent extends AppEvent {
	constructor(public readonly payload: PaymentWebhookEvent) {
		super();
	}
}

import type { PaymentWebhookEvent } from "../../application/services/payment-webhook.parser.interface";
import { DomainEvent } from "./domain-event";

export class CheckoutCompletedEvent extends DomainEvent {
	constructor(public readonly payload: PaymentWebhookEvent) {
		super();
	}
}

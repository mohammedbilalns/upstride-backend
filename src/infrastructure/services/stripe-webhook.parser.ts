import { injectable } from "inversify";
import Stripe from "stripe";
import type {
	IPaymentWebhookParser,
	PaymentWebhookEvent,
	PaymentWebhookEventType,
	PaymentWebhookParseInput,
} from "../../application/services/payment-webhook.parser.interface";
import { PaymentProvider } from "../../domain/entities/payment-transactions.entity";
import env from "../../shared/config/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

//FIX: violates OCP , Define a IPaymentEventHandler interface and register handlers per event type. New payment events get new handler classes without touching existing code.
@injectable()
export class StripeWebhookParser implements IPaymentWebhookParser {
	async parse(
		input: PaymentWebhookParseInput,
	): Promise<PaymentWebhookEvent | null> {
		const event = stripe.webhooks.constructEvent(
			input.payload,
			input.signature,
			env.STRIPE_WEBHOOK_SECRET,
		);

		if (
			event.type !== "checkout.session.completed" &&
			event.type !== "checkout.session.expired" &&
			event.type !== "checkout.session.async_payment_failed"
		) {
			return null;
		}

		const session = event.data.object as Stripe.Checkout.Session;
		return this._mapSessionEvent(event.type, session);
	}

	private _mapSessionEvent(
		type: PaymentWebhookEventType,
		session: Stripe.Checkout.Session,
	): PaymentWebhookEvent {
		const userId = session.metadata?.userId;
		const coins = Number(session.metadata?.coins ?? 0);
		const currency = session.currency ?? "inr";
		const amountMinor = session.amount_total ?? 0;

		return {
			type,
			provider: PaymentProvider.Stripe,
			sessionId: session.id,
			userId,
			coins,
			amountMinor,
			currency,
			metadata: session.metadata as Record<string, string>,
		};
	}
}

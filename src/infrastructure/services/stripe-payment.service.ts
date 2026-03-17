import { injectable } from "inversify";
import Stripe from "stripe";
import type {
	CreateCheckoutSessionParams,
	CreateCheckoutSessionResult,
	IPaymentService,
} from "../../application/services/payment.service.interface";
import env from "../../shared/config/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

@injectable()
export class StripePaymentService implements IPaymentService {
	async createCheckoutSession(
		params: CreateCheckoutSessionParams,
	): Promise<CreateCheckoutSessionResult> {
		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: params.currency,
						product_data: {
							name: "Coins",
							description: `${params.coins} coins`,
						},
						unit_amount: params.amount,
					},
					quantity: 1,
				},
			],
			success_url: params.successUrl,
			cancel_url: params.cancelUrl,
			metadata: params.metadata,
		});

		return { id: session.id, url: session.url ?? null };
	}
}

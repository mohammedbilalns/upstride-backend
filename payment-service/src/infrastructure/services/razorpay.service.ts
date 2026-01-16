import Razorpay from "razorpay";
import crypto from "crypto";
import env from "../../infrastructure/config/env";
import { IPaymentGatewayService } from "../../domain/services/payment-gateway.service.interface";

export class RazorpayService implements IPaymentGatewayService {
	private razorpay: Razorpay;

	constructor() {
		this.razorpay = new Razorpay({
			key_id: env.RAZORPAY_KEY_ID,
			key_secret: env.RAZORPAY_KEY_SECRET,
		});
	}

	async createOrder(amount: number, currency: string = "INR") {
		const options = {
			amount: amount * 100,
			currency,
			receipt: `receipt_${Date.now()}`,
		};

		const order = await this.razorpay.orders.create(options);

		return {
			id: order.id,
			amount: Number(order.amount),
			currency: order.currency,
			keyId: env.RAZORPAY_KEY_ID,
		};
	}

	verifyPayment(
		orderId: string,
		paymentId: string,
		signature: string,
	): boolean {
		console.log("Verifying Payment - Inputs:", { orderId, paymentId, signature });
		console.log("Key Secret Length:", env.RAZORPAY_KEY_SECRET?.length);

		const generatedSignature = crypto
			.createHmac("sha256", env.RAZORPAY_KEY_SECRET)
			.update(orderId + "|" + paymentId)
			.digest("hex");

		console.log("Signatures:", { generated: generatedSignature, received: signature });

		return generatedSignature === signature;
	}
}

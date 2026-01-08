import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import env from "../config/env";
import { IPaymentGatewayService } from "../../domain/services/payment-gateway.service.interface";

export class PayPalService implements IPaymentGatewayService {
	private _client: checkoutNodeJssdk.core.PayPalHttpClient;

	constructor() {
		const environment =
			process.env.PAYPAL_MODE === "live"
				? new checkoutNodeJssdk.core.LiveEnvironment(
						env.PAYPAL_CLIENT_ID,
						env.PAYPAL_CLIENT_SECRET,
					)
				: new checkoutNodeJssdk.core.SandboxEnvironment(
						env.PAYPAL_CLIENT_ID,
						env.PAYPAL_CLIENT_SECRET,
					);

		this._client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);
	}

	async createOrder(
		amount: number,
		currency: string = "USD",
	): Promise<{ id: string; approvalLink: string }> {
		const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
		request.prefer("return=representation");
		request.requestBody({
			intent: "CAPTURE",
			purchase_units: [
				{
					amount: {
						currency_code: currency,
						value: amount.toString(),
					},
				},
			],
		});

		try {
			const response = await this._client.execute(request);
			const orderId = response.result.id;
			const approvalLink = response.result.links.find(
				(link: any) => link.rel === "approve",
			).href;
			return { id: orderId, approvalLink };
		} catch (error) {
			console.error("PayPal Create Order Error:", error);
			throw error;
		}
	}

	async captureOrder(orderId: string): Promise<boolean> {
		const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
		// @ts-ignore -
		request.requestBody({});

		try {
			const response = await this._client.execute(request);
			return response.result.status === "COMPLETED";
		} catch (error) {
			console.error("PayPal Capture Order Error:", error);
			throw error;
		}
	}
}

export interface IPaymentGatewayService {
	createOrder(
		amount: number,
		currency?: string,
	): Promise<{ id: string; amount: number; currency: string; keyId: string }>;

	verifyPayment(orderId: string, paymentId: string, signature: string): boolean;
}

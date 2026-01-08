export interface IPaymentGatewayService {
	createOrder(
		amount: number,
		currency?: string,
	): Promise<{ id: string; approvalLink: string }>;
	captureOrder(orderId: string): Promise<boolean>;
}

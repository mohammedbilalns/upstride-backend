export interface CreateCheckoutSessionParams {
	userId: string;
	coins: number;
	amount: number;
	currency: string;
	successUrl: string;
	cancelUrl: string;
	metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionResult {
	id: string;
	url: string | null;
}

export interface IPaymentService {
	createCheckoutSession(
		params: CreateCheckoutSessionParams,
	): Promise<CreateCheckoutSessionResult>;
}

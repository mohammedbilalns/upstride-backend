export interface CreateCheckoutSessionInput {
	userId: string;
	coins: number;
	successUrl: string;
	cancelUrl: string;
}

export interface CreateCheckoutSessionOutput {
	paymentId: string;
	url: string | null;
	amount: number;
	currency: string;
	coins: number;
}

export interface CreateCheckoutSessionInput {
	userId: string;
	coins: number;
}

export interface CreateCheckoutSessionOutput {
	sessionId: string;
	url: string | null;
	amount: number;
	currency: string;
	coins: number;
}

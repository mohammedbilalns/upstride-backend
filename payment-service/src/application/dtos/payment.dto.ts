export interface CreatePaymentDto {
	userId: string;
	mentorId?: string;
	bookingId?: string;
	sessionId?: string;
	amount: number;
	currency?: string;
	paymentType?: 'BOOKING' | 'WALLET_LOAD';
}

export interface VerifyPaymentDto {
	orderId: string;
	paymentId: string;
	signature: string;
}

export interface GetPaymentHistoryDto {
	userId?: string;
	mentorId?: string;
}

export interface WebhookEventDto {
	event_type: string;
	resource: any;
}

export interface PayWithWalletDto {
	userId: string;
	mentorId: string;
	slotId: string;
	bookingId: string;
	amount: number;
	currency?: string;
}

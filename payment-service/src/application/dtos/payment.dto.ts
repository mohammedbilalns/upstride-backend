export interface CreatePaymentDto {
	userId: string;
	mentorId: string;
	bookingId: string;
	sessionId?: string;
	amount: number;
	currency?: string;
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

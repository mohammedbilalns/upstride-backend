export interface CreatePaymentDto {
	userId: string;
	mentorId: string;
	sessionId?: string;
	amount: number;
	currency?: string;
}

export interface CapturePaymentDto {
	paymentId?: string;
	transactionId?: string;
}

export interface GetPaymentHistoryDto {
	userId?: string;
	mentorId?: string;
}

export interface WebhookEventDto {
	event_type: string;
	resource: any;
}

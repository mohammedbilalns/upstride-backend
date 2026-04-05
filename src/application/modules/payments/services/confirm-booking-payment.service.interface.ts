export interface ConfirmBookingPaymentParams {
	bookingId: string;
	sessionId: string;
	amountMinor: number;
	currency: string;
	userId: string;
}

export interface IConfirmBookingPaymentService {
	confirm(params: ConfirmBookingPaymentParams): Promise<void>;
}

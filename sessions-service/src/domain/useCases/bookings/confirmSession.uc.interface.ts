export interface IConfirmSessionUC {
	execute(bookingId: string, paymentId: string): Promise<void>;
}

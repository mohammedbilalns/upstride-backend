export interface PaymentDetails {
	id: string;
	userId: string;
	amount: number;
	currency: string;
	status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
	transactionId?: string;
	paymentMethod: "RAZORPAY";
	createdAt: Date;
}

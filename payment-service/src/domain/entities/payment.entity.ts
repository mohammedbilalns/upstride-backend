export enum PaymentPurpose {
	BOOKING = "BOOKING",
	WALLET_LOAD = "WALLET_LOAD",
}

export interface Payment {
	id: string;
	userId: string;
	mentorId?: string;
	bookingId?: string;
	orderId: string;
	paymentId?: string;
	signature?: string;
	sessionId?: string;
	amount: number;
	currency: string;
	status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
	purpose?: PaymentPurpose;
	transactionId?: string;
	paymentMethod: "RAZORPAY";
	createdAt: Date;
	updatedAt: Date;
}

export interface Payment {
	id: string;
	userId: string;
	mentorId: string;
	sessionId?: string;
	amount: number;
	currency: string;
	status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
	transactionId?: string;
	paymentMethod: "RAZORPAY";
	createdAt: Date;
	updatedAt: Date;
}

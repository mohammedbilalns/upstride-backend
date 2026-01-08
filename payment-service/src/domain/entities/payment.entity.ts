export interface Payment {
	id: string;
	userId: string;
	mentorId: string;
	sessionId?: string;
	amount: number;
	currency: string;
	status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
	transactionId?: string;
	paymentMethod: "PAYPAL";
	createdAt: Date;
	updatedAt: Date;
}

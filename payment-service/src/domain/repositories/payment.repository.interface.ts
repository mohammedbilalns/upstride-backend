import { Payment } from "../entities/payment.entity";

export interface IPaymentRepository {
	create(payment: Omit<Payment, "id">): Promise<Payment>;
	updateStatus(id: string, status: Payment["status"]): Promise<Payment | null>;
	findById(id: string): Promise<Payment | null>;
	findByTransactionId(transactionId: string): Promise<Payment | null>;
	findByUserId(userId: string): Promise<Payment[]>;
	findByMentorId(mentorId: string): Promise<Payment[]>;
}

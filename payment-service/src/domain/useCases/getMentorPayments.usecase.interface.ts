import { Payment } from "../entities/payment.entity";

export interface IGetMentorPaymentsUC {
	execute(mentorId: string): Promise<Payment[]>;
}

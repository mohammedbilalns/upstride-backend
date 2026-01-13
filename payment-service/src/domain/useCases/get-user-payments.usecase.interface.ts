import { Payment } from "../entities/payment.entity";

export interface IGetUserPaymentsUC {
	execute(userId: string): Promise<Payment[]>;
}

import { PaymentDetails } from "../../common/types/payment.types";

export interface IPaymentService {
	getPaymentById(paymentId: string): Promise<PaymentDetails>;
	getPaymentsByIds(paymentIds: string[]): Promise<PaymentDetails[]>;
}

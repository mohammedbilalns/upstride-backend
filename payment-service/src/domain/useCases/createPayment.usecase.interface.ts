import { CreatePaymentDto } from "../../application/dtos/payment.dto";

export interface ICreatePaymentUC {
	execute(data: CreatePaymentDto): Promise<{
		approvalLink: string;
		paymentId: string;
		transactionId?: string;
	}>;
}

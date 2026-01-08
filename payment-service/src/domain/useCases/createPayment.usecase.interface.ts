import { CreatePaymentDto } from "../../application/dtos/payment.dto";

export interface ICreatePaymentUC {
	execute(data: CreatePaymentDto): Promise<{
		id: string; // Razorpay Order ID
		amount: number;
		currency: string;
		keyId: string;
		paymentId: string;
	}>;
}

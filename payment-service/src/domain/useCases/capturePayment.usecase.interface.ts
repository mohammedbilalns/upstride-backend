import { VerifyPaymentDto } from "../../application/dtos/payment.dto";
import { Payment } from "../entities/payment.entity";

export interface ICapturePaymentUC {
	execute(data: VerifyPaymentDto): Promise<Payment | null>;
}

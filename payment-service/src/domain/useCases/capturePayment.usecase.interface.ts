import { CapturePaymentDto } from "../../application/dtos/payment.dto";
import { Payment } from "../entities/payment.entity";

export interface ICapturePaymentUC {
	execute(data: CapturePaymentDto): Promise<Payment | null>;
}

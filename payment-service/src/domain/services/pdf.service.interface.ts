import { Payment } from "../entities/payment.entity";

export interface IPdfService {
    generateReceipt(payment: Payment): Promise<Buffer>;
    createDocument(): any;
}

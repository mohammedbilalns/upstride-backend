import { Payment } from "../../domain/entities/payment.entity";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";

export interface IGetPaymentsByIdsUC {
    execute(paymentIds: string[]): Promise<Payment[]>;
}

export class GetPaymentsByIdsUC implements IGetPaymentsByIdsUC {
    constructor(private paymentRepository: IPaymentRepository) { }

    async execute(paymentIds: string[]): Promise<Payment[]> {

        return this.paymentRepository.findByIds(paymentIds);
    }
}

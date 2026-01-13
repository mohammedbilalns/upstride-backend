import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { IGetUserPaymentsUC } from "../../domain/useCases/get-user-payments.usecase.interface";

export class GetUserPaymentsUC implements IGetUserPaymentsUC {
	constructor(private _paymentRepository: IPaymentRepository) {}

	async execute(userId: string) {
		return this._paymentRepository.findByUserId(userId);
	}
}

import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { IGetMentorPaymentsUC } from "../../domain/useCases/get-mentor-payments.usecase.interface";

export class GetMentorPaymentsUC implements IGetMentorPaymentsUC {
	constructor(private _paymentRepository: IPaymentRepository) {}

	async execute(mentorId: string) {
		return this._paymentRepository.findByMentorId(mentorId);
	}
}

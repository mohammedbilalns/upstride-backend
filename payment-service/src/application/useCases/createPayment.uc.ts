import { CreatePaymentDto } from "../../application/dtos/payment.dto";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { ICreatePaymentUC } from "../../domain/useCases/createPayment.usecase.interface";
import { IPaymentGatewayService } from "../../domain/services/payment-gateway.service.interface";

export class CreatePaymentUC implements ICreatePaymentUC {
	constructor(
		private _paymentRepository: IPaymentRepository,
		private _paymentGatewayService: IPaymentGatewayService,
	) {}

	async execute(data: CreatePaymentDto) {
		const currency = data.currency || "USD";

		//  Create Order in Payment Gateway
		const { id: orderId, approvalLink } =
			await this._paymentGatewayService.createOrder(data.amount, currency);

		const paymentData = {
			userId: data.userId,
			mentorId: data.mentorId,
			sessionId: data.sessionId,
			amount: data.amount,
			currency: currency,
			status: "PENDING" as const,
			transactionId: orderId,
			paymentMethod: "PAYPAL" as const,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const payment = await this._paymentRepository.create(paymentData);

		return {
			approvalLink,
			paymentId: payment.id,
			transactionId: payment.transactionId,
		};
	}
}

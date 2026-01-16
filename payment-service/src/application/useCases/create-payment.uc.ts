import { CreatePaymentDto } from "../../application/dtos/payment.dto";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { ICreatePaymentUC } from "../../domain/useCases/create-payment.usecase.interface";
import { IPaymentGatewayService } from "../../domain/services/payment-gateway.service.interface";

export class CreatePaymentUC implements ICreatePaymentUC {
	constructor(
		private _paymentRepository: IPaymentRepository,
		private _paymentGatewayService: IPaymentGatewayService,
	) { }

	async execute(paymentDetails: CreatePaymentDto) {
		const currency = paymentDetails.currency || "INR";

		//  Create Order in Payment Gateway
		const order = await this._paymentGatewayService.createOrder(
			paymentDetails.amount,
			currency,
		);

		const paymentData = {
			userId: paymentDetails.userId,
			mentorId: paymentDetails.mentorId || "",
			bookingId: paymentDetails.bookingId || "",
			sessionId: paymentDetails.sessionId,
			amount: paymentDetails.amount,
			currency: currency,
			status: "PENDING" as const,
			transactionId: order.id,
			orderId: order.id,
			paymentMethod: "RAZORPAY" as const,
			purpose: paymentDetails.paymentType === 'WALLET_LOAD' ? 'WALLET_LOAD' : 'BOOKING' as any, // Map DTO type to Entity enum
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const payment = await this._paymentRepository.create(paymentData as any);

		return {
			...order,
			paymentId: payment.id,
		};
	}
}

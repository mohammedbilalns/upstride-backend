import { VerifyPaymentDto } from "../../application/dtos/payment.dto";
import { ICapturePaymentUC } from "../../domain/useCases/capturePayment.usecase.interface";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { IPaymentGatewayService } from "../../domain/services/payment-gateway.service.interface";
import { AppError } from "../../application/errors/AppError";
import { HttpStatus } from "../../common/enums";
import { ErrorMessage } from "../../common/enums/errorMessages";
import { IEventBus } from "../../domain/events/IEventBus";
import { QueueEvents } from "../../common/enums/queueEvents";

export class CapturePaymentUC implements ICapturePaymentUC {
	constructor(
		private _paymentRepository: IPaymentRepository,
		private _paymentGatewayService: IPaymentGatewayService,
		private _eventBus: IEventBus,
	) {}

	async execute(verificationDetails: VerifyPaymentDto) {
		//  Find Payment
		let payment = await this._paymentRepository.findByTransactionId(
			verificationDetails.orderId,
		);

		if (!payment) {
			throw new AppError(ErrorMessage.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		if (payment.status === "COMPLETED") {
			return payment;
		}

		// Verify Signature
		const isValid = this._paymentGatewayService.verifyPayment(
			verificationDetails.orderId,
			verificationDetails.paymentId,
			verificationDetails.signature,
		);

		if (isValid) {
			// Update DB
			const updated = await this._paymentRepository.updateStatus(
				payment.id,
				"COMPLETED",
			);

			const eventPayload = {
				orderId: payment.bookingId || payment.transactionId,
				paymentId: payment.id,
				userId: payment.userId,
				mentorId: payment.mentorId,
			};

			// Publish Payment Completed Event
			await this._eventBus.publish(QueueEvents.PAYMENT_COMPLETED, eventPayload);

			return updated;
		} else {
			await this._paymentRepository.updateStatus(payment.id, "FAILED");
			throw new AppError("Payment verification failed", HttpStatus.BAD_GATEWAY);
		}
	}
}

import { CapturePaymentDto } from "../../application/dtos/payment.dto";
import { ICapturePaymentUC } from "../../domain/useCases/capturePayment.usecase.interface";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { IPaymentGatewayService } from "../../domain/services/payment-gateway.service.interface";
import { AppError } from "../../application/errors/AppError";
import { HttpStatus } from "../../common/enums";
import { ErrorMessage } from "../../common/enums/errorMessage";

export class CapturePaymentUC implements ICapturePaymentUC {
	constructor(
		private _paymentRepository: IPaymentRepository,
		private _paymentGatewayService: IPaymentGatewayService,
	) {}

	async execute(data: CapturePaymentDto) {
		//  Find Payment
		let payment;
		if (data.transactionId) {
			payment = await this._paymentRepository.findByTransactionId(
				data.transactionId,
			);
		}

		if (!payment && data.paymentId) {
			payment = await this._paymentRepository.findById(data.paymentId);
		}

		if (!payment) {
			throw new AppError(ErrorMessage.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		if (payment.status === "COMPLETED") {
			return payment;
		}

		// Capture Order via PayPal
		const success = await this._paymentGatewayService.captureOrder(
			payment.transactionId!,
		);

		if (success) {
			// Update DB
			const updated = await this._paymentRepository.updateStatus(
				payment.id,
				"COMPLETED",
			);
			return updated;
		} else {
			await this._paymentRepository.updateStatus(payment.id, "FAILED");
			throw new AppError(
				ErrorMessage.PAYPAL_CAPTURE_FAILED,
				HttpStatus.BAD_GATEWAY,
			);
		}
	}
}

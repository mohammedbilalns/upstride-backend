import { Request, Response } from "express";
import { HttpStatus } from "../../../common/enums";
import asyncHandler from "../utils/async-handler";
import {
	createPaymentSchema,
	verifyPaymentSchema,
	getUserPaymentsSchema,
	getMentorPaymentsSchema,
} from "../validations/payment.validation";
import { ICreatePaymentUC } from "../../../domain/useCases/create-payment.usecase.interface";
import { ICapturePaymentUC } from "../../../domain/useCases/capture-payment.usecase.interface";
import { IGetUserPaymentsUC } from "../../../domain/useCases/get-user-payments.usecase.interface";
import { IGetMentorPaymentsUC } from "../../../domain/useCases/get-mentor-payments.usecase.interface";
import { IHandleWebhookUC } from "../../../domain/useCases/handle-webhook.usecase.interface";
import logger from "../../../common/utils/logger";

export class PaymentController {
	constructor(
		private _createPaymentUC: ICreatePaymentUC,
		private _capturePaymentUC: ICapturePaymentUC,
		private _getUserPaymentsUC: IGetUserPaymentsUC,
		private _getMentorPaymentsUC: IGetMentorPaymentsUC,
		private _handleWebhookUC: IHandleWebhookUC,
	) {}

	createPayment = asyncHandler(async (req: Request, res: Response) => {
		const paymentData = createPaymentSchema.parse(req.body);

		const result = await this._createPaymentUC.execute(paymentData);
		res.status(HttpStatus.CREATED).json(result);
	});

	capturePayment = asyncHandler(async (req: Request, res: Response) => {
		const { orderId, paymentId, signature } = verifyPaymentSchema.parse(
			req.body,
		);

		const result = await this._capturePaymentUC.execute({
			orderId,
			paymentId,
			signature,
		});
		res.status(HttpStatus.OK).json(result);
	});

	handleWebhook = asyncHandler(async (req: Request, res: Response) => {
		try {
			const event = req.body;
			await this._handleWebhookUC.execute(event);
			res.status(HttpStatus.OK).send();
		} catch (error) {
			logger.error("Webhook processing error", error);
			res.status(HttpStatus.OK).send();
		}
	});

	getUserPayments = asyncHandler(async (req: Request, res: Response) => {
		const { userId } = getUserPaymentsSchema.parse(req.query);
		const results = await this._getUserPaymentsUC.execute(userId);
		res.status(HttpStatus.OK).json(results);
	});

	getMentorPayments = asyncHandler(async (req: Request, res: Response) => {
		const { mentorId } = getMentorPaymentsSchema.parse(req.query);
		const results = await this._getMentorPaymentsUC.execute(mentorId);
		res.status(HttpStatus.OK).json(results);
	});
}

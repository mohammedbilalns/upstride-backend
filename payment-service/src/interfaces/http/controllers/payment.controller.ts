import { Request, Response } from "express";
import { HttpStatus } from "../../../common/enums";
import asyncHandler from "../utils/asyncHandler";
import {
	createPaymentSchema,
	capturePaymentSchema,
	getUserPaymentsSchema,
	getMentorPaymentsSchema,
} from "../validations/payment.validation";
import { ICreatePaymentUC } from "../../../domain/useCases/createPayment.usecase.interface";
import { ICapturePaymentUC } from "../../../domain/useCases/capturePayment.usecase.interface";
import { IGetUserPaymentsUC } from "../../../domain/useCases/getUserPayments.usecase.interface";
import { IGetMentorPaymentsUC } from "../../../domain/useCases/getMentorPayments.usecase.interface";
import { IHandleWebhookUC } from "../../../domain/useCases/handleWebhook.usecase.interface";

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
		const { paymentId, transactionId } = capturePaymentSchema.parse(req.body);

		const result = await this._capturePaymentUC.execute({
			paymentId,
			transactionId,
		});
		res.status(HttpStatus.OK).json(result);
	});

	handleWebhook = asyncHandler(async (req: Request, res: Response) => {
		try {
			const event = req.body;
			await this._handleWebhookUC.execute(event);
			res.status(HttpStatus.OK).send();
		} catch (error) {
			console.error("Webhook processing error", error);
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

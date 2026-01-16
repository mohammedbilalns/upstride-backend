import { Request, Response } from "express";
import { HttpStatus } from "../../../common/enums";
import asyncHandler from "../utils/async-handler";
import {
	createPaymentSchema,
	verifyPaymentSchema,
	getUserPaymentsSchema,
	getMentorPaymentsSchema,
	payWithWalletSchema,
} from "../validations/payment.validation";
import { ResponseMessage } from "../../../common/enums/response-messages";
import { ICreatePaymentUC } from "../../../domain/useCases/create-payment.usecase.interface";
import { ICapturePaymentUC } from "../../../domain/useCases/capture-payment.usecase.interface";
import { IGetUserPaymentsUC } from "../../../domain/useCases/get-user-payments.usecase.interface";
import { IGetMentorPaymentsUC } from "../../../domain/useCases/get-mentor-payments.usecase.interface";
import { IHandleWebhookUC } from "../../../domain/useCases/handle-webhook.usecase.interface";
import logger from "../../../common/utils/logger";

import { IPayWithWalletUC } from "../../../domain/useCases/pay-with-wallet.usecase.interface";
import { IGetPaymentReceiptUC } from "../../../domain/useCases/payments/get-payment-receipt.uc.interface";
import { IGetPaymentsByIdsUC } from "../../../application/useCases/get-payments-by-ids.uc";

export class PaymentController {
	constructor(
		private _createPaymentUC: ICreatePaymentUC,
		private _capturePaymentUC: ICapturePaymentUC,
		private _getUserPaymentsUC: IGetUserPaymentsUC,
		private _getMentorPaymentsUC: IGetMentorPaymentsUC,
		private _handleWebhookUC: IHandleWebhookUC,
		private _payWithWalletUC: IPayWithWalletUC,
		private _getPaymentReceiptUC: IGetPaymentReceiptUC,
		private _getPaymentsByIdsUC: IGetPaymentsByIdsUC,
	) { }

	payWithWallet = asyncHandler(async (req: Request, res: Response) => {
		const { id: userId } = res.locals.user;
		const { slotId, mentorId, amount, bookingId } = payWithWalletSchema.parse(req.body);
		await this._payWithWalletUC.execute({
			userId,
			mentorId,
			slotId,
			bookingId,
			amount: Number(amount)
		});

		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.PAYMENT_SUCCESSFUL
		});
	});

	createPayment = asyncHandler(async (req: Request, res: Response) => {
		const { id: userId } = res.locals.user || {};
		const paymentData = createPaymentSchema.parse({
			...req.body,
			userId,
		});

		const result = await this._createPaymentUC.execute(paymentData);
		res.status(HttpStatus.CREATED).json({
			message: ResponseMessage.PAYMENT_INITIATED,
			data: result
		});
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
		res.status(HttpStatus.OK).json({
			message: ResponseMessage.PAYMENT_CAPTURED,
			data: result
		});
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
		res.status(HttpStatus.OK).json({
			message: ResponseMessage.TRANSACTION_HISTORY_RETRIEVED,
			data: results
		});
	});

	getMentorPayments = asyncHandler(async (req: Request, res: Response) => {
		const { mentorId } = getMentorPaymentsSchema.parse(req.query);
		const results = await this._getMentorPaymentsUC.execute(mentorId);
		res.status(HttpStatus.OK).json({
			message: ResponseMessage.TRANSACTION_HISTORY_RETRIEVED,
			data: results
		});
	});

	getPaymentReceipt = asyncHandler(async (req: Request, res: Response) => {
		const { id: userId } = res.locals.user;
		const { paymentId } = req.params;

		const pdfBuffer = await this._getPaymentReceiptUC.execute(userId, paymentId);

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", `attachment; filename=receipt-${paymentId}.pdf`);
		res.send(pdfBuffer);
	});

	getPaymentsByIds = asyncHandler(async (req: Request, res: Response) => {
		let ids: string[] = [];
		const queryIds = req.query.ids;

		if (typeof queryIds === 'string') {
			ids = queryIds.split(',');
		} else if (Array.isArray(queryIds)) {
			ids = queryIds as string[];
		}

		if (ids.length === 0) {
			res.status(HttpStatus.OK).json([]);
			return;
		}

		const payments = await this._getPaymentsByIdsUC.execute(ids);
		res.status(HttpStatus.OK).json(payments);
	});
}

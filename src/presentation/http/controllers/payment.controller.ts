import type { Response } from "express";
import { inject, injectable } from "inversify";
import type {
	ICreateCheckoutSessionUseCase,
	IHandleStripeWebhookUseCase,
} from "../../../application/payments/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { PaymentResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";

interface CreateCheckoutSessionBody {
	coins: number;
}

@injectable()
export class PaymentController {
	constructor(
		@inject(TYPES.UseCases.CreateCheckoutSession)
		private readonly createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
		@inject(TYPES.UseCases.HandleStripeWebhook)
		private readonly handleStripeWebhookUseCase: IHandleStripeWebhookUseCase,
	) {}

	createCheckoutSession = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { coins } = (req.validated?.body ??
				req.body) as CreateCheckoutSessionBody;
			const userId = req.user.id;

			const session = await this.createCheckoutSessionUseCase.execute({
				userId,
				coins,
			});

			return sendSuccess(res, HttpStatus.OK, {
				message: PaymentResponseMessages.CHECKOUT_SESSION_CREATED,
				data: session,
			});
		},
	);

	handleStripeWebhook = asyncHandler(async (req, res) => {
		const signature = req.headers["stripe-signature"];
		if (!signature || Array.isArray(signature)) {
			res.status(HttpStatus.BAD_REQUEST).json({
				success: false,
				message: "Missing Stripe signature",
			});
			return;
		}

		if (!Buffer.isBuffer(req.body)) {
			res.status(HttpStatus.BAD_REQUEST).json({
				success: false,
				message: "Invalid webhook payload",
			});
			return;
		}

		await this.handleStripeWebhookUseCase.execute({
			signature,
			payload: req.body,
		});

		res.status(HttpStatus.OK).json({ received: true });
	});
}

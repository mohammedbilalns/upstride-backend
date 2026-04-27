import { inject, injectable } from "inversify";
import { TYPES } from "../../../../shared/types/types";
import type { IPaymentWebhookParser } from "../../../services/payment-webhook.parser.interface";
import type { HandlePaymentWebhookInput } from "../dtos/handle-payment-webhook.dto";
import type { IHandlePaymentWebhookUseCase } from "./handle-payment-webhook.use-case.interface";
import type { IProcessPaymentEventUseCase } from "./process-payment-event.use-case.interface";

@injectable()
export class HandlePaymentWebhookUseCase
	implements IHandlePaymentWebhookUseCase
{
	constructor(
		@inject(TYPES.Services.PaymentWebhookParser)
		private readonly _paymentWebhookParser: IPaymentWebhookParser,
		@inject(TYPES.UseCases.ProcessPaymentEvent)
		private readonly _processPaymentEventUseCase: IProcessPaymentEventUseCase,
	) {}

	async execute(input: HandlePaymentWebhookInput): Promise<void> {
		const event = await this._paymentWebhookParser.parse(input);
		if (!event) {
			throw new Error("Failed parse payment webhook input");
		}

		await this._processPaymentEventUseCase.execute(event);
	}
}

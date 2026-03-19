import { inject, injectable } from "inversify";
import { TYPES } from "../../../shared/types/types";
import type { IPaymentWebhookParser } from "../../services/payment-webhook.parser.interface";
import type { HandlePaymentWebhookInput } from "../dtos/handle-payment-webhook.dto";
import type { IHandlePaymentWebhookUseCase } from "./handle-payment-webhook.usecase.interface";
import type { IProcessPaymentEventUseCase } from "./process-payment-event.usecase.interface";

@injectable()
export class HandlePaymentWebhookUseCase
	implements IHandlePaymentWebhookUseCase
{
	constructor(
		@inject(TYPES.Services.PaymentWebhookParser)
		private readonly paymentWebhookParser: IPaymentWebhookParser,
		@inject(TYPES.UseCases.ProcessPaymentEvent)
		private readonly processPaymentEventUseCase: IProcessPaymentEventUseCase,
	) {}

	async execute(input: HandlePaymentWebhookInput): Promise<void> {
		const event = await this.paymentWebhookParser.parse(input);
		if (!event) {
			return;
		}

		await this.processPaymentEventUseCase.execute(event);
	}
}

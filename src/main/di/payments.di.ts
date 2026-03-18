import type { Container } from "inversify";
import {
	CreateCheckoutSessionUseCase,
	HandlePaymentWebhookUseCase,
	type ICreateCheckoutSessionUseCase,
	type IHandlePaymentWebhookUseCase,
} from "../../application/payments/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerPaymentsBindings = (container: Container): void => {
	container
		.bind<ICreateCheckoutSessionUseCase>(TYPES.UseCases.CreateCheckoutSession)
		.to(CreateCheckoutSessionUseCase)
		.inSingletonScope();
	container
		.bind<IHandlePaymentWebhookUseCase>(TYPES.UseCases.HandlePaymentWebhook)
		.to(HandlePaymentWebhookUseCase)
		.inSingletonScope();
};

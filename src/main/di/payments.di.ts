import type { Container } from "inversify";
import {
	CreateCheckoutSessionUseCase,
	HandlePaymentWebhookUseCase,
	type ICreateCheckoutSessionUseCase,
	type IHandlePaymentWebhookUseCase,
	type IProcessPaymentEventUseCase,
	ProcessPaymentEventUseCase,
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
	container
		.bind<IProcessPaymentEventUseCase>(TYPES.UseCases.ProcessPaymentEvent)
		.to(ProcessPaymentEventUseCase)
		.inSingletonScope();
};

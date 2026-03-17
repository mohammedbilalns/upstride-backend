import type { Container } from "inversify";
import {
	CreateCheckoutSessionUseCase,
	HandleStripeWebhookUseCase,
	type ICreateCheckoutSessionUseCase,
	type IHandleStripeWebhookUseCase,
} from "../../application/payments/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerPaymentsBindings = (container: Container): void => {
	container
		.bind<ICreateCheckoutSessionUseCase>(TYPES.UseCases.CreateCheckoutSession)
		.to(CreateCheckoutSessionUseCase)
		.inSingletonScope();
	container
		.bind<IHandleStripeWebhookUseCase>(TYPES.UseCases.HandleStripeWebhook)
		.to(HandleStripeWebhookUseCase)
		.inSingletonScope();
};

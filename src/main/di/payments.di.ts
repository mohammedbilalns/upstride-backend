import type { Container } from "inversify";
import { CheckoutCompletedHandler } from "../../application/events/handlers/payment/checkout-completed.handler";
import { CheckoutExpiredHandler } from "../../application/events/handlers/payment/checkout-expired.handler";
import { CheckoutFailedHandler } from "../../application/events/handlers/payment/checkout-failed.handler";
import { RefundService } from "../../application/modules/payments/services/refund.service";
import type { IRefundService } from "../../application/modules/payments/services/refund.service.interface";
import {
	CreateCheckoutSessionUseCase,
	HandlePaymentWebhookUseCase,
	type ICreateCheckoutSessionUseCase,
	type IHandlePaymentWebhookUseCase,
	type IProcessPaymentEventUseCase,
	ProcessPaymentEventUseCase,
} from "../../application/modules/payments/use-cases";
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
	container
		.bind<CheckoutCompletedHandler>(TYPES.PaymentHandlers.CheckoutCompleted)
		.to(CheckoutCompletedHandler)
		.inSingletonScope();
	container
		.bind<CheckoutExpiredHandler>(TYPES.PaymentHandlers.CheckoutExpired)
		.to(CheckoutExpiredHandler)
		.inSingletonScope();
	container
		.bind<CheckoutFailedHandler>(TYPES.PaymentHandlers.CheckoutFailed)
		.to(CheckoutFailedHandler)
		.inSingletonScope();
	container
		.bind<IRefundService>(TYPES.Services.RefundService)
		.to(RefundService)
		.inSingletonScope();
};

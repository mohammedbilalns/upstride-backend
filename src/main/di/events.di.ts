import type { Container } from "inversify";
import type { CheckoutCompletedHandler } from "../../application/events/handlers/payment/checkout-completed.handler";
import type { CheckoutExpiredHandler } from "../../application/events/handlers/payment/checkout-expired.handler";
import type { CheckoutFailedHandler } from "../../application/events/handlers/payment/checkout-failed.handler";
import { SignupRewardHandler } from "../../application/events/handlers/signup-reward.handler";
import type { PlatformSettingsService } from "../../application/services/platform-settings.service";
import type { IWalletService } from "../../application/services/wallet.service.interface";
import type { BullMQEventBus } from "../../infrastructure/events/bullmq-event-bus";
import { TYPES } from "../../shared/types/types";

export const bootstrapEventHandlers = (container: Container): void => {
	const eventBus = container.get<BullMQEventBus>(TYPES.Services.EventBus);
	const walletService = container.get<IWalletService>(
		TYPES.Services.WalletService,
	);
	const platformSettings = container.get<PlatformSettingsService>(
		TYPES.Services.PlatformSettings,
	);

	const signupHandler = new SignupRewardHandler(
		walletService,
		platformSettings,
	);

	const checkoutCompletedHandler = container.get<CheckoutCompletedHandler>(
		TYPES.PaymentHandlers.CheckoutCompleted,
	);
	const checkoutExpiredHandler = container.get<CheckoutExpiredHandler>(
		TYPES.PaymentHandlers.CheckoutExpired,
	);
	const checkoutFailedHandler = container.get<CheckoutFailedHandler>(
		TYPES.PaymentHandlers.CheckoutFailed,
	);

	eventBus.registerHandler(
		"UserRegisteredEvent",
		signupHandler.handle.bind(signupHandler),
	);
	eventBus.registerHandler(
		"CheckoutCompletedEvent",
		checkoutCompletedHandler.handleEvent.bind(checkoutCompletedHandler),
	);
	eventBus.registerHandler(
		"CheckoutExpiredEvent",
		checkoutExpiredHandler.handleEvent.bind(checkoutExpiredHandler),
	);
	eventBus.registerHandler(
		"CheckoutFailedEvent",
		checkoutFailedHandler.handleEvent.bind(checkoutFailedHandler),
	);
};

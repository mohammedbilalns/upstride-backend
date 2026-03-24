import type { Container } from "inversify";
import { MessageSentHandler } from "../../application/events/handlers/chat/message-sent.handler";
import type { CheckoutCompletedHandler } from "../../application/events/handlers/payment/checkout-completed.handler";
import type { CheckoutExpiredHandler } from "../../application/events/handlers/payment/checkout-expired.handler";
import type { CheckoutFailedHandler } from "../../application/events/handlers/payment/checkout-failed.handler";
import { SignupRewardHandler } from "../../application/events/handlers/signup-reward.handler";
import type { ICreateNotificationUseCase } from "../../application/modules/notifications/use-cases/create-notification.usecase.interface";
import type { PlatformSettingsService } from "../../application/services/platform-settings.service";
import type { IWalletService } from "../../application/services/wallet.service.interface";
import { WebSocketEventBridge } from "../../infrastructure/events/websocket-event-bridge";
import { TYPES } from "../../shared/types/types";
import { bullMQEventBus, inMemoryEventBus } from "./queues.di";

export const bootstrapEventHandlers = (container: Container): void => {
	// Initialize WebSocket Bridge
	const wsBridge = new WebSocketEventBridge(
		container.get(TYPES.Services.WebSocketServer),
	);
	wsBridge.register(inMemoryEventBus);

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

	const messageSentHandler = new MessageSentHandler(
		container.get<ICreateNotificationUseCase>(
			TYPES.UseCases.CreateNotification,
		),
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

	// Durable (BullMQ) Bus Registrations -
	bullMQEventBus.registerHandler(
		"UserRegisteredEvent",
		signupHandler.handle.bind(signupHandler),
	);
	bullMQEventBus.registerHandler(
		"chat.message.sent",
		messageSentHandler.handle.bind(messageSentHandler),
	);
	bullMQEventBus.registerHandler(
		"CheckoutCompletedEvent",
		checkoutCompletedHandler.handleEvent.bind(checkoutCompletedHandler),
	);
	bullMQEventBus.registerHandler(
		"CheckoutExpiredEvent",
		checkoutExpiredHandler.handleEvent.bind(checkoutExpiredHandler),
	);
	bullMQEventBus.registerHandler(
		"CheckoutFailedEvent",
		checkoutFailedHandler.handleEvent.bind(checkoutFailedHandler),
	);
};

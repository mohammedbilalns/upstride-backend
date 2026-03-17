import { SignupRewardHandler } from "../../application/event-handlers/signup-reward.handler";
import type { EventBus } from "../../application/events/event-bus.interface";
import type { PlatformSettingsService } from "../../application/services/platform-settings.service";
import type { IWalletService } from "../../application/services/wallet.service.interface";
import { container } from "../../main/container";
import { TYPES } from "../../shared/types/types";

export const bootstrapEvents = (): void => {
	const eventBus = container.get<EventBus>(TYPES.Services.EventBus);
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

	eventBus.subscribe(
		"UserRegisteredEvent",
		signupHandler.handle.bind(signupHandler),
	);
};

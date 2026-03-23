import type { Container } from "inversify";
import type { EventBus } from "../../application/events/event-bus.interface";
import { SignupRewardHandler } from "../../application/events/handlers/signup-reward.handler";
import type { PlatformSettingsService } from "../../application/services/platform-settings.service";
import type { IWalletService } from "../../application/services/wallet.service.interface";
import { bootstrapEvents } from "../../infrastructure/events/bootstrap";
import { TYPES } from "../../shared/types/types";

//FIX: manually wires handlers** instead of using the container, as noted — but the deeper DIP violation is that `infrastructure/events/bootstrap.ts` imports from `main/container`, creating a circular-leaning dependency between infrastructure and composition root.
export const bootstrapEventHandlers = (container: Container): void => {
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

	bootstrapEvents(eventBus, signupHandler);
};

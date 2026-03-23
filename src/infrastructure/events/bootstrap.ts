import type { EventBus } from "../../application/events/event-bus.interface";
import type { SignupRewardHandler } from "../../application/events/handlers/signup-reward.handler";

export const bootstrapEvents = (
	eventBus: EventBus,
	signupHandler: SignupRewardHandler,
): void => {
	eventBus.subscribe(
		"UserRegisteredEvent",
		signupHandler.handle.bind(signupHandler),
	);
};

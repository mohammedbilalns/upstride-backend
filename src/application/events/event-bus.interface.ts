import type { AppEvent } from "../../domain/events/app-event";

export interface EventBus {
	publish(event: AppEvent): Promise<void>;
	registerHandler<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void;
}

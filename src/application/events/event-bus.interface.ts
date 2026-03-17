import type { DomainEvent } from "../../domain/events/domain-event";

export interface EventBus {
	publish(event: DomainEvent): Promise<void>;
	subscribe<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void;
}

import { EventEmitter } from "events";
import type { EventBus } from "../../application/events/event-bus.interface";
import type { DomainEvent } from "../../domain/events/domain-event";

export class NodeEventBus implements EventBus {
	private emitter = new EventEmitter();

	async publish(event: DomainEvent): Promise<void> {
		this.emitter.emit(event.eventName, event);
	}

	subscribe<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void {
		this.emitter.on(eventName, handler);
	}
}

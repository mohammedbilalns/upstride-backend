import { EventEmitter } from "node:events";
import type { EventBus } from "../../application/events/event-bus.interface";
import type { DomainEvent } from "../../domain/events/domain-event";

export class NodeEventBus implements EventBus {
	private _emitter = new EventEmitter();

	async publish(event: DomainEvent): Promise<void> {
		this._emitter.emit(event.eventName, event);
	}

	registerHandler<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void {
		this._emitter.on(eventName, handler);
	}
}

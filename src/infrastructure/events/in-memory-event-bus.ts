import { EventEmitter } from "node:events";
import type { RealtimeEventBus } from "../../application/events/realtime-event-bus.interface";
import type { AppEvent } from "../../domain/events/app-event";

/**
 *  implementation of the EventBus using Node.js EventEmitter.
 */
export class InMemoryEventBus implements RealtimeEventBus {
	private _emitter = new EventEmitter();

	/**
	 * Publishes an event to all registered in-memory handlers.
	 */
	async publish(event: AppEvent): Promise<void> {
		this._emitter.emit(event.eventName, event);
	}

	/**
	 * Registers an event handler for a specific event type.
	 */
	registerHandler<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void {
		this._emitter.on(eventName, (data) => {
			// Catch  errors in handlers to avoid event loop issues
			Promise.resolve(handler(data)).catch((err) => {
				console.error(
					`Error in InMemoryEventBus handler for ${eventName}:`,
					err,
				);
			});
		});
	}
}

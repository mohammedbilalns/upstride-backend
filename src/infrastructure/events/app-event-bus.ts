import type { EventBus } from "../../application/events/event-bus.interface";
import type { AppEvent } from "../../domain/events/domain-event";

/**
 * Application EventBus that orchestrates multiple underlying bus implementations.
 */
export class AppEventBus implements EventBus {
	private _buses: EventBus[];

	constructor(buses: EventBus[]) {
		this._buses = buses;
	}

	/**
	 * Publishes the event to all registered underlying buses.
	 */
	async publish(event: AppEvent): Promise<void> {
		await Promise.all(this._buses.map((bus) => bus.publish(event)));
	}

	/**
	 * Registers the handler with all underlying buses.
	 * Note: Depending on requirements, you might want to only register on specific buses.
	 * For now, we apply to all to maintain consistency with the interface.
	 */
	registerHandler<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void {
		for (const bus of this._buses) {
			bus.registerHandler(eventName, handler);
		}
	}
}

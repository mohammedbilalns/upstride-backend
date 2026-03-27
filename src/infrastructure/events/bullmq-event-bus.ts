import { randomUUID } from "node:crypto";
import type { Queue } from "bullmq";
import type { EventBus } from "../../application/events/event-bus.interface";
import type { AppEvent } from "../../domain/events/domain-event";

export const APP_EVENTS_QUEUE = "appEvents";

/**
 * BullMQ implementation of the EventBus.
 * Publishes domain events as jobs to a BullMQ queue for async processing by workers.
 * Supports retry logic, dead-letter handling, and in-memory handler registration.
 */
export class BullMQEventBus implements EventBus {
	private _queue: Queue;
	private _handlers = new Map<
		string,
		((event: unknown) => Promise<void> | void)[]
	>();

	constructor(queue: Queue) {
		this._queue = queue;
	}

	/**
	 * Publishes a event to the BullMQ queue.
	 * The event is serialized and queued as a job with retry support.
	 */
	async publish(event: AppEvent): Promise<void> {
		const safeEventName = event.eventName.replace(/[^a-zA-Z0-9_-]/g, "-");
		const jobId = `${safeEventName}-${randomUUID()}`;

		await this._queue.add(
			event.eventName,
			{
				eventName: event.eventName,
				occurredAt: event.occurredAt.toISOString(),
				payload: JSON.parse(JSON.stringify(event)),
			},
			{
				jobId,
				attempts: 3,
				backoff: { type: "exponential", delay: 1000 },
				removeOnComplete: { count: 1000, age: 24 * 3600 },
				removeOnFail: { count: 5000 },
			},
		);
	}

	/**
	 * Registers an event handler for a specific event type.
	 * Handlers are stored in-memory and invoked by workers processing events.
	 */
	registerHandler<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void {
		const handlers = this._handlers.get(eventName);
		if (!handlers) {
			this._handlers.set(eventName, [
				handler as (event: unknown) => Promise<void> | void,
			]);
			return;
		}

		handlers.push(handler as (event: unknown) => Promise<void> | void);
	}

	/** Retrieves all registered handlers for a given event name. */
	getHandlers(eventName: string) {
		return this._handlers.get(eventName) ?? [];
	}
}

import { randomUUID } from "node:crypto";
import type { Queue } from "bullmq";
import type { EventBus } from "../../application/events/event-bus.interface";
import type { DomainEvent } from "../../domain/events/domain-event";

export const DOMAIN_EVENTS_QUEUE = "domainEvents";

export class BullMQEventBus implements EventBus {
	private _queue: Queue;
	private _handlers = new Map<
		string,
		((event: unknown) => Promise<void> | void)[]
	>();

	constructor(queue: Queue) {
		this._queue = queue;
	}

	async publish(event: DomainEvent): Promise<void> {
		const jobId = `${event.eventName}:${randomUUID()}`;

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

	registerHandler<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void {
		if (!this._handlers.has(eventName)) {
			this._handlers.set(eventName, []);
		}
		this._handlers
			.get(eventName)!
			.push(handler as (event: unknown) => Promise<void> | void);
	}

	getHandlers(eventName: string) {
		return this._handlers.get(eventName) ?? [];
	}
}

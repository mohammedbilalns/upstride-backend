import { randomUUID } from "node:crypto";

/**
 * Base class for all application events.
 * capture meaningful state changes that occurred in the system.
 */
export abstract class AppEvent {
	public abstract readonly eventName: string;
	public readonly occurredAt: Date = new Date();
	public readonly eventId: string = randomUUID();
}

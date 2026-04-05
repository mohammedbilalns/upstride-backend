import { randomUUID } from "node:crypto";

export type EventMeta = {
	realtime?: boolean;
};
/**
 * Base class for all application events.
 */
export abstract class AppEvent {
	public abstract readonly eventName: string;
	public abstract readonly payload: unknown;
	public readonly meta?: EventMeta;
	public readonly occurredAt: Date = new Date();
	public readonly eventId: string = randomUUID();
}

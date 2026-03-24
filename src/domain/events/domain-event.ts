/**
 * Base class for all application events.
 * capture meaningful state changes that occurred in the system.
 */
export abstract class AppEvent {
	public readonly occurredAt: Date = new Date();

	/** Returns the event's class name as the event identifier. */
	get eventName(): string {
		return this.constructor.name;
	}
}

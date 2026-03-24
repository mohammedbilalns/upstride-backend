export abstract class AppEvent {
	public readonly occurredAt: Date = new Date();

	get eventName(): string {
		return this.constructor.name;
	}
}

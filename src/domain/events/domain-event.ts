export abstract class DomainEvent {
	public readonly occurredAt: Date = new Date();

	get eventName(): string {
		return this.constructor.name;
	}
}

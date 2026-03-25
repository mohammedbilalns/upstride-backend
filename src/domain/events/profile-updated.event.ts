import type { AppEvent } from "./domain-event";

export class ProfileUpdatedEvent implements AppEvent {
	readonly eventName = "profile.updated";
	readonly occurredAt = new Date();

	constructor(
		public readonly userId: string,
		public readonly name?: string,
		public readonly avatarUrl?: string,
	) {}
}

import { DomainEvent } from "./domain-event";

export class ProfileUpdatedEvent extends DomainEvent {
	readonly eventName = "profile.updated";

	constructor(
		public readonly payload: {
			userId: string;
			name?: string;
			interests?: string[];
			avatarUrl?: string;
		},
	) {
		super();
	}
}

import { DomainEvent } from "./domain-event";

export class UserRegisteredEvent extends DomainEvent {
	readonly eventName = "user.registered";

	constructor(
		public readonly payload: {
			userId: string;
			email: string;
		},
	) {
		super();
	}
}

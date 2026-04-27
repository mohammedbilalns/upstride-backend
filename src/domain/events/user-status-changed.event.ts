import { DomainEvent } from "./domain-event";
export class UserStatusChangedEvent extends DomainEvent {
	readonly eventName = "user.status.changed";

	constructor(
		public readonly payload: {
			userId: string;
			isBlocked: boolean;
		},
	) {
		super();
	}
}

import { AppEvent } from "./domain-event";
export class UserStatusChangedEvent extends AppEvent {
	constructor(
		public readonly userId: string,
		public readonly isBlocked: boolean,
	) {
		super();
	}
}

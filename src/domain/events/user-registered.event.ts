import { AppEvent } from "./domain-event";

export class UserRegisteredEvent extends AppEvent {
	constructor(
		public readonly userId: string,
		public readonly email: string,
	) {
		super();
	}
}

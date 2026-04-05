import { AppEvent } from "./app-event";

export class UserRegisteredEvent extends AppEvent {
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

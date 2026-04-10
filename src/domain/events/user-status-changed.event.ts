import { AppEvent } from "./app-event";
export class UserStatusChangedEvent extends AppEvent {
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

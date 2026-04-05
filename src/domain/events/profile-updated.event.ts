import { AppEvent } from "./app-event";

export class ProfileUpdatedEvent extends AppEvent {
	readonly eventName = "profile.updated";

	constructor(
		public readonly payload: {
			userId: string;
			name?: string;
			avatarUrl?: string;
		},
	) {
		super();
	}
}

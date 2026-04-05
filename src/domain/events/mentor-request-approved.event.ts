import { AppEvent } from "./app-event";

export class MentorRequestApprovedEvent extends AppEvent {
	readonly eventName = "mentor.request.approved";

	constructor(
		public readonly payload: {
			mentorId: string;
		},
	) {
		super();
	}
}

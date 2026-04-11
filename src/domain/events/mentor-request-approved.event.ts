import { DomainEvent } from "./domain-event";

export class MentorRequestApprovedEvent extends DomainEvent {
	readonly eventName = "mentor.request.approved";

	constructor(
		public readonly payload: {
			mentorId: string;
		},
	) {
		super();
	}
}

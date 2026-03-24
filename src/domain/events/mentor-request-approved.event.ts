import { AppEvent } from "./domain-event";

export class MentorRequestApprovedEvent extends AppEvent {
	constructor(public readonly mentorId: string) {
		super();
	}
}

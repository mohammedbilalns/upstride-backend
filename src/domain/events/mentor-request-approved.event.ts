import { DomainEvent } from "./domain-event";

export class MentorRequestApprovedEvent extends DomainEvent {
	constructor(public readonly mentorId: string) {
		super();
	}
}

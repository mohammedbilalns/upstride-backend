import { ConflictError } from "../../shared/errors/conflict-error";

export class MentorAlreadySavedError extends ConflictError {
	constructor(message = "Mentor already saved in the list") {
		super(message);
	}
}

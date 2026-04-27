import { NotFoundError } from "./not-found-error";

export class MentorNotFoundError extends NotFoundError {
	constructor(message = "Mentor not found") {
		super(message);
	}
}

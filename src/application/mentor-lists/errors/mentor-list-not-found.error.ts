import { NotFoundError } from "../../shared/errors/not-found-error";

export class MentorListNotFoundError extends NotFoundError {
	constructor(message = "Mentor list not found") {
		super(message);
	}
}

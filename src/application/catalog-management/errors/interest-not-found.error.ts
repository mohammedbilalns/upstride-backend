import { NotFoundError } from "../../shared/errors/not-found-error";

export class InterestNotFound extends NotFoundError {
	constructor(message = "Interest not found") {
		super(message);
	}
}

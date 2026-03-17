import { NotFoundError } from "../../shared/errors/not-found-error";

export class AvailabilityNotFoundError extends NotFoundError {
	constructor(message = "Availability not found") {
		super(message);
	}
}

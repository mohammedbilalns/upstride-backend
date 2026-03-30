import { NotFoundError } from "../../../shared/errors";

export class AvailabilityNotFoundError extends NotFoundError {
	constructor(message = "Availability not found") {
		super(message);
	}
}

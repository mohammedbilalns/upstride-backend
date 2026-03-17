import { ConflictError } from "../../shared/errors/conflict-error";

export class CannotCancelBookedSlotError extends ConflictError {
	constructor(message = "Cannot cancel booked slot") {
		super(message);
	}
}

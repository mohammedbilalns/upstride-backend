import { ConflictError } from "../../../shared/errors/conflict-error";

export class CannotEnableBookedSlotError extends ConflictError {
	constructor(message = "Cannot enable booked slot") {
		super(message);
	}
}

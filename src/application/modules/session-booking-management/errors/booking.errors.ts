import { NotFoundError } from "../../../shared/errors/not-found-error";
import { ValidationError } from "../../../shared/errors/validation-error";

export class BookingNotFoundError extends NotFoundError {
	constructor() {
		super("Booking not found");
	}
}

export class BookingAlreadyCancelledError extends ValidationError {
	constructor() {
		super("Booking is already cancelled");
	}
}

export class BookingCannotBeCancelledError extends ValidationError {
	constructor() {
		super("Booking cannot be cancelled");
	}
}

export class BookingNotConfirmedForRescheduleError extends ValidationError {
	constructor() {
		super("Only confirmed bookings can be rescheduled");
	}
}

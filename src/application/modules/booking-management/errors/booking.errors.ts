import { ConflictError, NotFoundError } from "../../../shared/errors";

export class SlotNotAvailableError extends ConflictError {
	constructor(message = "Requested time slot is not available") {
		super(message);
	}
}

export class BookingNotFoundError extends NotFoundError {
	constructor(message: string = "Booking Not found") {
		super(message);
	}
}

export class BookingAlreadyCancelledError extends ConflictError {
	constructor(message = "Booking has already been cancelled") {
		super(message);
	}
}

import { ValidationError } from "../../shared/errors/validation-error";

export class SlotNotAvailableError extends ValidationError {
	constructor(message = "Slot not available") {
		super(message);
	}
}

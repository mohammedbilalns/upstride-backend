import { ValidationError } from "../../../shared/errors/validation-error";

export class RescheduleWindowPassedError extends ValidationError {
	constructor() {
		super("Reschedule window has passed");
	}
}

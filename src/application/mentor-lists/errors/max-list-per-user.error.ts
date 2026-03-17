import { ValidationError } from "../../shared/errors/validation-error";

export class MaxListPerUserError extends ValidationError {
	constructor(message = "Maximum of 20 mentor lists allowed") {
		super(message);
	}
}

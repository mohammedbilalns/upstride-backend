import { ValidationError } from "../../../shared/errors/validation-error";

export class InvalidMessageError extends ValidationError {
	constructor(message = "Message must include content or media") {
		super(message);
	}
}

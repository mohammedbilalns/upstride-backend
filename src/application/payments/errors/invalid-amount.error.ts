import { ValidationError } from "../../shared/errors/validation-error";

export class InvalidAmountError extends ValidationError {
	constructor(message = "Invalid amount") {
		super(message);
	}
}

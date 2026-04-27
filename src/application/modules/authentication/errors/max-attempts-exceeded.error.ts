import { HttpStatus } from "../../../../shared/constants";
import { ApplicationError } from "../../../shared/errors/app-error";

export class MaxAttemptsExceededError extends ApplicationError {
	constructor(message = "Maximum OTP verification attempts exceeded") {
		super(message, HttpStatus.TOO_MANY_ATTEMPTS);
	}
}

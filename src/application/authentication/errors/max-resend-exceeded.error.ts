import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "../../shared/errors/app-error";

export class MaxResendsExceededError extends ApplicationError {
	constructor(message = "Maximum OTP resend attempts exceeded") {
		super(message, HttpStatus.TOO_MANY_ATTEMPTS);
	}
}

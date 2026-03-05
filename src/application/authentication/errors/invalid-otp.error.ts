import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "../../shared/errors/app-error";

export class InvalidOtpError extends ApplicationError {
	constructor(message = "Invalid or expired OTP") {
		super(message, HttpStatus.BAD_REQUEST);
	}
}

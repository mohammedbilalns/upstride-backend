import { HttpStatus } from "../../../../shared/constants";
import { ApplicationError } from "../../../shared/errors/app-error";

export class UserAlreadyExistsError extends ApplicationError {
	constructor(
		message = "There is already an account with this email, Please try again with a different email",
	) {
		super(message, HttpStatus.CONFLICT);
	}
}

import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "../../shared/errors/app-error";

export class AuthenticationError extends ApplicationError {
	constructor(message = "Invalid Credentials") {
		super(message, HttpStatus.UNAUTHORIZED);
	}
}

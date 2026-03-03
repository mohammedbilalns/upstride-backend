import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "../../shared/errors/app-error";

export class UserAlreadyExistsError extends ApplicationError {
	constructor(message = "User already exists") {
		super(message, HttpStatus.CONFLICT);
	}
}

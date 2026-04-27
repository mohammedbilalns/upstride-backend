import { HttpStatus } from "../../../../shared/constants";
import { ApplicationError } from "../../../shared/errors/app-error";

export class InvalidPasswordError extends ApplicationError {
	constructor(message = "Invalid Password") {
		super(message, HttpStatus.BAD_REQUEST);
	}
}

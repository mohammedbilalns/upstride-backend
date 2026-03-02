import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "./app-error";

export class ConflictError extends ApplicationError {
	constructor(message = "Resource conflict") {
		super(message, HttpStatus.CONFLICT);
	}
}

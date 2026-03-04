import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "./app-error";

export class ValidationError extends ApplicationError {
	constructor(message = "Invalid Input") {
		super(message, HttpStatus.BAD_REQUEST);
	}
}

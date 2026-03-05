import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "./app-error";

export class NotFoundError extends ApplicationError {
	constructor(message = "Resource not found") {
		super(message, HttpStatus.NOT_FOUND);
	}
}

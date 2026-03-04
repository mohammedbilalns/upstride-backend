import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "../../shared/errors/app-error";

export class UnauthorizedError extends ApplicationError {
	constructor(message = "Unauthorized") {
		super(message, HttpStatus.UNAUTHORIZED);
	}
}

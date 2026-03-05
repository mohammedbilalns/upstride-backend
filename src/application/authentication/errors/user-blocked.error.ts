import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "../../shared/errors/app-error";

export class UserBlockedError extends ApplicationError {
	constructor(message = "You are blocked from the platform contact the admin") {
		super(message, HttpStatus.FORBIDDEN);
	}
}

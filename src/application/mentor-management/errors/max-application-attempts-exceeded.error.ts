import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "../../shared/errors/app-error";

export class MaxApplicationAttemptsExceededError extends ApplicationError {
	constructor(message = "Maximum application attempts exceeded.") {
		super(message, HttpStatus.BAD_REQUEST);
	}
}

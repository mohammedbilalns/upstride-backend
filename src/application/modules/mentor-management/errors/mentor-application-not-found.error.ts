import { HttpStatus } from "../../../../shared/constants";
import { ApplicationError } from "../../../shared/errors/app-error";

export class MentorApplicationNotFoundError extends ApplicationError {
	constructor(message = "Mentor application not found.") {
		super(message, HttpStatus.NOT_FOUND);
	}
}

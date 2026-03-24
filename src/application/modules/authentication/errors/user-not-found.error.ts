import { HttpStatus } from "../../../../shared/constants";
import { ApplicationError } from "../../../shared/errors/app-error";

export class UserNotFoundError extends ApplicationError {
	constructor(message: string = "User not found") {
		super(message, HttpStatus.NOT_FOUND);
	}
}

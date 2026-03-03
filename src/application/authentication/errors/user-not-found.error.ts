import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "../../shared/errors/app-error";

export class UserNotFoundError extends ApplicationError {
	constructor(message: string) {
		super(message, HttpStatus.NOT_FOUND);
	}
}

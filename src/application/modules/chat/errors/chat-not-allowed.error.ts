import { ValidationError } from "../../../shared/errors/validation-error";

export class ChatNotAllowedError extends ValidationError {
	constructor(message = "Chat is not allowed for these users") {
		super(message);
	}
}

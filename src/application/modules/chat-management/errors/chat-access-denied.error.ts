import { ValidationError } from "../../../shared/errors/validation-error";

export class ChatAccessDeniedError extends ValidationError {
	constructor(message = "User is not part of this chat") {
		super(message);
	}
}

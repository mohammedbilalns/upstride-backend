import { ValidationError } from "../../../shared/errors/validation-error";

export class ChatSelfChatError extends ValidationError {
	constructor(message = "Cannot chat with yourself") {
		super(message);
	}
}

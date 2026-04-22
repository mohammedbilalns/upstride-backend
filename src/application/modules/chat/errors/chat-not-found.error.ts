import { NotFoundError } from "../../../shared/errors/not-found-error";

export class ChatNotFoundError extends NotFoundError {
	constructor(message = "Chat not found") {
		super(message);
	}
}

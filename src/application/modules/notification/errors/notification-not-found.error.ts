import { NotFoundError } from "../../../shared/errors/not-found-error";

export class NotificationNotFoundError extends NotFoundError {
	constructor(message = "Notification not found") {
		super(message);
	}
}

import { NotFoundError } from "./not-found-error";

export class UserNotFoundError extends NotFoundError {
	constructor(message: string = "User not found") {
		super(message);
	}
}

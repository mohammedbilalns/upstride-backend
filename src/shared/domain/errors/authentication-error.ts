import { DomainError } from "./domain-error.js";

export class AuthenticationError extends DomainError {
	constructor(message = "Authentication failed") {
		super(message);
	}
}

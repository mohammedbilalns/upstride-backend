import { DomainError } from "./domain-error.js";

export class ConflictError extends DomainError {
	constructor(message = "Resource conflict") {
		super(message);
	}
}

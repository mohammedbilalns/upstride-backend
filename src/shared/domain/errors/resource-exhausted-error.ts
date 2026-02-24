import { DomainError } from "./domain-error.js";

export class ResourceExhaustedError extends DomainError {
	constructor(message = "Resource exhausted") {
		super(message);
	}
}

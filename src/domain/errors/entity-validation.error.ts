import { DomainError } from "./domain-error";

export class EntityValidationError extends DomainError {
	constructor(entityName: string, message: string) {
		super(`${entityName}: ${message}`);
	}
}

import { ValidationError } from "../../shared/errors/validation-error";

export class CatalogLimitExceededError extends ValidationError {
	constructor(message = "Catalog limit exceeded") {
		super(message);
	}
}

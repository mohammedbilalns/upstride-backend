import { BaseError } from "../../shared/errors/base.error";

export abstract class DomainError extends BaseError {
	constructor(message: string, statusCode = 400) {
		super(message, statusCode);
	}
}

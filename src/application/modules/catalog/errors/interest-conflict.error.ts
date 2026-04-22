import { ConflictError } from "../../../shared/errors/conflict-error";

export class InterestConflictError extends ConflictError {
	constructor(message = "Interest already exists") {
		super(message);
	}
}

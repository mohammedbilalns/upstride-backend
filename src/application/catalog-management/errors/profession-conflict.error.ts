import { ConflictError } from "../../shared/errors/conflict-error";

export class ProfessionConflictError extends ConflictError {
	constructor(message = "Profession already exists") {
		super(message);
	}
}

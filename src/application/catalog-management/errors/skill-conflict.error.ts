import { ConflictError } from "../../shared/errors/conflict-error";

export class SkillConflictError extends ConflictError {
	constructor(message = "Skill already exists") {
		super(message);
	}
}

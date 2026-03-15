import { ConflictError } from "../../shared/errors/conflict-error";

export class SkillConflict extends ConflictError {
	constructor(message = "Skill already exists") {
		super(message);
	}
}

import { ValidationError } from "../../../shared/errors/validation-error";

export class MaxMentorsPerListError extends ValidationError {
	constructor(message = "Maximum of 150 mentors per list allowed") {
		super(message);
	}
}

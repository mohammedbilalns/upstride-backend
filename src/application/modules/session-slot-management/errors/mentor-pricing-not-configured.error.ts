import { ValidationError } from "../../../shared/errors/validation-error";

export class MentorPricingNotConfiguredError extends ValidationError {
	constructor() {
		super("Mentor pricing is not configured");
	}
}

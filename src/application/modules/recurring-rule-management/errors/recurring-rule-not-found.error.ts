import { NotFoundError } from "../../../shared/errors/not-found-error";

export class RecurringRuleNotFoundError extends NotFoundError {
	constructor(message = "Recurring rule not found") {
		super(message);
	}
}

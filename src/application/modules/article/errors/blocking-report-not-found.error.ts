import { NotFoundError } from "../../../shared/errors/not-found-error";

export class BlockingReportNotFoundError extends NotFoundError {
	constructor(
		message = "The report associated with this article block was not found",
	) {
		super(message);
	}
}

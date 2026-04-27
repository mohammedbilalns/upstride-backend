import { NotFoundError } from "../../../shared/errors/not-found-error";

export class ReportNotFoundError extends NotFoundError {
	constructor(message = "Report not found") {
		super(message);
	}
}

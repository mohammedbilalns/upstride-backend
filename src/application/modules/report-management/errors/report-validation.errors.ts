import { ValidationError } from "../../../shared/errors/validation-error";

export class ReportSelfError extends ValidationError {
	constructor(target: "article" | "user") {
		super(
			target === "article"
				? "You cannot report your own article"
				: "You cannot report yourself",
		);
	}
}

export class ReportAlreadyExistsError extends ValidationError {
	constructor(target: "article" | "user") {
		super(
			target === "article"
				? "You have already reported this article"
				: "You have already reported this user",
		);
	}
}

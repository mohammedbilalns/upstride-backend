import { ValidationError } from "../../../shared/errors/validation-error";

export class ArticleNotBlockedError extends ValidationError {
	constructor(message = "This article is not currently blocked") {
		super(message);
	}
}

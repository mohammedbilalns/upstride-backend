import { NotFoundError } from "../../../shared/errors/not-found-error";

export class ArticleNotFoundError extends NotFoundError {
	constructor(message = "Article not found") {
		super(message);
	}
}

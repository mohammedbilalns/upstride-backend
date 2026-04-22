import { NotFoundError } from "../../../shared/errors/not-found-error";

export class ArticleCommentNotFoundError extends NotFoundError {
	constructor(message = "Comment not found") {
		super(message);
	}
}

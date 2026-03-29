import { ValidationError } from "../../../shared/errors/validation-error";

export class MentorOnlyArticleActionError extends ValidationError {
	constructor(action: "create" | "update") {
		super(`Only mentors can ${action} articles`);
	}
}

export class ArticleOwnershipError extends ValidationError {
	constructor(action: "update" | "delete") {
		super(`You can only ${action} your own articles`);
	}
}

export class ArticleCommentOwnershipError extends ValidationError {
	constructor(action: "update" | "delete") {
		super(`You can only ${action} your own comments`);
	}
}

import { HttpStatus } from "../../../../shared/constants";
import { BaseError } from "../../../../shared/errors/base.error";

export class ArticleBlockedByAdminError extends BaseError {
	constructor(
		message: string = "Article is blocked by admin and cannot be modified",
	) {
		super(message, HttpStatus.FORBIDDEN);
	}
}

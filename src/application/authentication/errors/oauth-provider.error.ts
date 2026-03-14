import { HttpStatus } from "../../../shared/constants";
import { ApplicationError } from "../../shared/errors/app-error";

export class OAuthProviderError extends ApplicationError {
	constructor(message = "OAuth provider unavailable, Try a different method") {
		super(message, HttpStatus.BAD_GATEWAY);
	}
}

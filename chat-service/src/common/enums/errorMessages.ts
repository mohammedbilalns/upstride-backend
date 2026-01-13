export enum ErrorMessage {
	TOKEN_NOT_FOUND = "We could not find the required token.",
	BLOCKED_FROM_PLATFORM = "Your account has been blocked. Please contact support for assistance.",
	TOKEN_EXPIRED = "Your session has expired. Please log in again.",
	INVALID_TOKEN = "The provided token is invalid.",
	FORBIDDEN_RESOURCE = "You do not have permission to access this resource.",
	TOO_MANY_REQUESTS = "You are making too many requests. Please try again later.",
	SERVER_ERROR = "An internal server error occurred. Please try again later.",
	VALIDATION_FAILED = "The validation of your request failed.",
	INTERNAL_SERVER_ERROR = "An internal server error occurred. Please try again later.",
	INVALID_INPUT = "The input data provided is invalid.",
	CHAT_NOT_FOUND = "We could not find the specified chat.",
	FAILED_TO_FETCH_USERS = "We encountered an issue fetching the user data.",
}

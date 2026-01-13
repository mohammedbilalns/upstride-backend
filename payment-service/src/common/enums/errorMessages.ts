export enum ErrorMessage {
	PAYMENT_NOT_FOUND = "We could not find the specified payment.",
	TRANSACTION_ID_REQUIRED = "A Payment ID or Transaction ID is required to proceed.",
	USER_ID_REQUIRED = "The User ID is required.",
	MENTOR_ID_REQUIRED = "The Mentor ID is required.",
	PAYPAL_CAPTURE_FAILED = "We encountered an issue capturing the PayPal payment. Please try again.",
	CHECK_REQUIRED_FIELDS = "Please check that all required fields are provided.",

	// Auth & Middleware Errors
	TOKEN_NOT_FOUND = "We could not find the required token.",
	BLOCKED_FROM_PLATFORM = "Your account has been blocked. Please contact support for assistance.",
	TOKEN_EXPIRED = "Your session has expired. Please log in again.",
	INVALID_TOKEN = "The provided token is invalid.",
	FORBIDDEN_RESOURCE = "You do not have permission to access this resource.",
	VALIDATION_FAILED = "The validation of your request failed.",
	INTERNAL_SERVER_ERROR = "An internal server error occurred. Please try again later.",
	TOO_MANY_REQUESTS = "You are making too many requests. Please try again later.",
	SERVER_ERROR = "An internal server error occurred. Please try again later.",
}

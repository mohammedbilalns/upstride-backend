export enum ErrorMessage {
	PAYMENT_NOT_FOUND = "Payment not found",
	TRANSACTION_ID_REQUIRED = "Payment ID or Transaction ID required",
	USER_ID_REQUIRED = "User ID required",
	MENTOR_ID_REQUIRED = "Mentor ID required",
	PAYPAL_CAPTURE_FAILED = "PayPal Capture Failed",
	CHECK_REQUIRED_FIELDS = "Check required fields",

	// Auth & Middleware Errors
	TOKEN_NOT_FOUND = "Token not found",
	BLOCKED_FROM_PLATFORM = "User is blocked from the platform",
	TOKEN_EXPIRED = "Token has expired",
	INVALID_TOKEN = "Invalid token",
	FORBIDDEN_RESOURCE = "Access to this resource is forbidden",
	VALIDATION_FAILED = "Validation failed",
	INTERNAL_SERVER_ERROR = "Internal server error",
	TOO_MANY_REQUESTS = "Too many requests, please try again later",
	SERVER_ERROR = "Server error",
}

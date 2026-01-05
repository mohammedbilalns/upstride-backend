/**
 * Error messages.
 */
export const ErrorMessage = {
	TOO_MANY_REQUESTS: "Too many requests",
	BLOCKED_FROM_PLATFORM: "You are blocked from platform",
	TOKEN_NOT_FOUND: "Token not found",
	TOKEN_EXPIRED: "Token expired",
	INVALID_TOKEN: "Invalid token",
	INTERNAL_SERVER_ERROR: "Internal server error",
	VALIDATION_FAILED: "Validation failed",
	FORBIDDEN_RESOURCE: "Forbidden resource",
	// Auth & User Errors
} as const;

export type ErrorMessageKey = keyof typeof ErrorMessage;
export type ErrorMessageValue = (typeof ErrorMessage)[ErrorMessageKey];

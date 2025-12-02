/**
 * Error messages.
 */
export const ErrorMessage = {
	// Auth & User Errors
	USER_NOT_FOUND: "User not found",
	INVALID_CREDENTIALS: "Invalid email or password",
	EMAIL_ALREADY_EXISTS: "User with this email already exists",
	ALERADY_WITH_GOOGLE_ID:
		"Already registered with this Google ID, please login with Google",
	REGISTERED_WITH_GOOGLE_ID:
		"Cannot update password as you are registered with Google",
	INVALID_PASSWORD: "Invalid password",
	INVALID_USERID: "Invalid userId",
	TOO_MANY_NEW_EXPERTISES: "Too many new expertises",
	TOO_MANY_NEW_TOPICS: "Too many new topics",
	INVALID_INPUT: "Invalid input data",
	FAILED_TO_CREATE_EXPERTISES: "Failed to create expertises",

	// Account restrictions
	BLOCKED_FROM_PLATFORM:
		"Your account is blocked from the platform, contact support",
	UNAUTHORIZED: "Unauthorized access",
	FORBIDDEN: "Forbidden",
	FORBIDDEN_RESOURCE: "Forbidden resource",

	// Token & Session Errors
	INVALID_TOKEN_TYPE: "Invalid token type",
	INVALID_TOKEN: "Invalid token",
	TOKEN_NOT_FOUND: "Token not found",
	INVALID_REFRESH_TOKEN: "Invalid refresh token",
	TOKEN_EXPIRED: "Token expired",

	// Validation
	VALIDATION_FAILED: "Validation failed",

	// OTP
	OTP_NOT_FOUND: "OTP not found",
	INVALID_OTP: "Invalid OTP",
	TOO_MANY_OTP_ATTEMPTS: "Too many attempts, please register again",

	// Mentor / Skill Errors
	MENTOR_NOT_FOUND: "Mentor not found",
	MENTOR_ALREADY_APPROVED: "Mentor already approved",
	MENTOR_LIMIT_REACHED:
		"You have reached the limit of maximum 3 mentor requests",
	ALREADY_FOLLOWED: "You are already following this mentor",
	SKILL_ALREADY_EXISTS: "Skill already exists for this expertise",
	SKILL_NOT_FOUND: "Skill not found",

	// System
	TOO_MANY_REQUESTS: "Too many requests, please try again later",
	SERVER_ERROR: "Internal server error",
	INTERNAL_SERVER_ERROR: "Internal server error",
} as const;

export type ErrorMessageKey = keyof typeof ErrorMessage;
export type ErrorMessageValue = (typeof ErrorMessage)[ErrorMessageKey];

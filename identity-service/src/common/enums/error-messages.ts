/**
 * Error messages.
 */
export const ErrorMessage = {
	// Auth & User Errors
	USER_NOT_FOUND: "We could not find a user with the provided credentials.",
	INVALID_CREDENTIALS: "The email or password you entered is incorrect.",
	EMAIL_ALREADY_EXISTS: "A user with this email address already exists.",
	ALERADY_WITH_GOOGLE_ID:
		"This email is already associated with a Google account. Please log in using Google.",
	REGISTERED_WITH_GOOGLE_ID:
		"You cannot update your password because you are registered with Google.",
	INVALID_PASSWORD: "The password provided is invalid.",
	INVALID_USERID: "The provided user ID is invalid.",
	TOO_MANY_NEW_EXPERTISES: "You have exceeded the limit for new expertises.",
	TOO_MANY_NEW_TOPICS: "You have exceeded the limit for new topics.",
	INVALID_INPUT: "The input data provided is invalid.",
	FAILED_TO_CREATE_EXPERTISES:
		"We encountered an issue while creating expertises.",

	// Account restrictions
	BLOCKED_FROM_PLATFORM:
		"Your account has been blocked. Please contact support for assistance.",
	UNAUTHORIZED: "You are not authorized to access this resource.",
	FORBIDDEN: "Access to this resource is forbidden.",
	FORBIDDEN_RESOURCE: "You do not have permission to access this resource.",

	// Token & Session Errors
	INVALID_TOKEN_TYPE: "The token type provided is invalid.",
	INVALID_TOKEN: "The provided token is invalid.",
	TOKEN_NOT_FOUND: "We could not find the required token.",
	INVALID_REFRESH_TOKEN: "The refresh token provided is invalid.",
	TOKEN_EXPIRED: "Your session has expired. Please log in again.",

	// Validation
	VALIDATION_FAILED: "The validation of your request failed.",

	// OTP
	OTP_NOT_FOUND: "The OTP provided could not be found.",
	INVALID_OTP: "The OTP entered is incorrect.",
	TOO_MANY_OTP_ATTEMPTS:
		"You have made too many attempts. Please try registering again.",

	// Mentor / Skill Errors
	MENTOR_NOT_FOUND: "We could not find the specified mentor.",
	MENTOR_ALREADY_APPROVED: "This mentor has already been approved.",
	MENTOR_LIMIT_REACHED:
		"You have reached the maximum limit of 3 mentor requests.",
	ALREADY_FOLLOWED: "You are already following this mentor.",
	SKILL_ALREADY_EXISTS: "This skill already exists for the selected expertise.",
	SKILL_NOT_FOUND: "We could not find the specified skill.",

	// System
	TOO_MANY_REQUESTS:
		"You are making too many requests. Please try again later.",
	SERVER_ERROR: "An internal server error occurred. Please try again later.",
	INTERNAL_SERVER_ERROR:
		"An internal server error occurred. Please try again later.",
} as const;

export type ErrorMessageKey = keyof typeof ErrorMessage;
export type ErrorMessageValue = (typeof ErrorMessage)[ErrorMessageKey];

/**
 * Success messages.
 */
export const ResponseMessage = {
	// Authentication
	USER_REGISTERED: "Your registration has been completed successfully.",
	USER_ALREADY_EXISTS: "A user with this email already exists.",
	LOGIN_SUCCESS: "You have successfully logged in.",
	LOGOUT_SUCCESS: "You have been logged out successfully.",
	REFRESH_TOKEN_SUCCESS: "Your session token has been refreshed successfully.",

	// OTP
	OTP_SENT: "An OTP has been sent to your email. Please check your inbox.",
	OTP_RESENT: "A new OTP has been sent to your email. Please check your inbox.",
	OTP_VERIFIED: "The OTP has been verified successfully.",
	PASSWORD_UPDATED: "Your password has been updated successfully.",

	// User Management
	USER_BLOCKED: "The user has been blocked successfully.",
	USER_UNBLOCKED: "The user has been unblocked successfully.",

	// Mentors
	UPDATED_MENTOR: "The mentor's profile has been updated successfully.",
	MENTOR_REJECTED: "The mentor application has been rejected.",
	REQUEST_FOR_MENTORING: "Your mentorship request has been sent successfully.",
	MENTOR_REQUEST_SENT: "Your mentor request has been sent successfully.",
	MENTOR_APPROVED: "The mentor has been approved successfully.",
	FOLLOWED_MENTOR: "You are now following this mentor.",
	UNFOLLOWED_MENTOR: "You have successfully unfollowed this mentor.",

	// Expertise & Skills
	EXPERTISE_CREATED: "The expertise has been created successfully.",
	EXPERTISE_UPDATED: "The expertise has been updated successfully.",
	EXPERTISE_VERIFIED: "The expertise has been verified successfully.",
	SKILL_CREATED: "The skill has been created successfully.",
	SKILL_UPDATED: "The skill has been updated successfully.",
	SKILL_VERIFIED: "The skill has been verified successfully.",

	// Interests & Profile
	INTERESTS_FETCHED: "Interests have been fetched successfully.",
	INTERESTS_ADDED: "Your interests have been added successfully.",
	PROFILE_UPDATED: "Your profile has been updated successfully.",
} as const;

export type ResponseMessageKey = keyof typeof ResponseMessage;
export type ResponseMessageValue = (typeof ResponseMessage)[ResponseMessageKey];

/**
 * Success messages.
 */
export const ResponseMessage = {
	// Authentication
	USER_REGISTERED: "Registered successfully",
	USER_ALREADY_EXISTS: "User with this email already exists",
	LOGIN_SUCCESS: "Login successful",
	LOGOUT_SUCCESS: "Logged out successfully",
	REFRESH_TOKEN_SUCCESS: "Refresh token refreshed successfully",

	// OTP
	OTP_SENT: "OTP sent to your email, please check your inbox",
	OTP_RESENT: "OTP resent to your email, please check your inbox",
	OTP_VERIFIED: "OTP verified successfully",
	PASSWORD_UPDATED: "Password updated successfully",

	// User Management
	USER_BLOCKED: "User blocked successfully",
	USER_UNBLOCKED: "User unblocked successfully",

	// Mentors
	UPDATED_MENTOR: "Mentor updated successfully",
	MENTOR_REJECTED: "Mentor rejected successfully",
	REQUEST_FOR_MENTORING: "Request for mentoring sent successfully",
	MENTOR_REQUEST_SENT: "Mentor request sent successfully",
	MENTOR_APPROVED: "Mentor approved successfully",
	FOLLOWED_MENTOR: "Followed mentor successfully",
	UNFOLLOWED_MENTOR: "Unfollowed mentor successfully",

	// Expertise & Skills
	EXPERTISE_CREATED: "Expertise created successfully",
	EXPERTISE_UPDATED: "Expertise updated successfully",
	EXPERTISE_VERIFIED: "Expertise verified successfully",
	SKILL_CREATED: "Skill created successfully",
	SKILL_UPDATED: "Skill updated successfully",
	SKILL_VERIFIED: "Skill verified successfully",

	// Interests & Profile
	INTERESTS_FETCHED: "Interests fetched successfully",
	INTERESTS_ADDED: "Interests added successfully",
	PROFILE_UPDATED: "Updated profile successfully",
} as const;

export type ResponseMessageKey = keyof typeof ResponseMessage;
export type ResponseMessageValue = (typeof ResponseMessage)[ResponseMessageKey];

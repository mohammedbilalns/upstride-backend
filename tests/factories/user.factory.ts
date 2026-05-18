/** Shared constants used across authentication-related tests. */
export const VALID_EMAIL = "test@example.com";
export const HASHED_PASSWORD = "hashed-password";

/**
 * Builds a minimal user-shaped object that satisfies the domain entity.
 */
export const createUser = (overrides: Record<string, unknown> = {}) => ({
	id: "user-1",
	email: VALID_EMAIL,
	passwordHash: HASHED_PASSWORD,
	isBlocked: false,
	authType: "LOCAL",
	isVerified: true,
	...overrides,
});

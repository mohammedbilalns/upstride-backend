import { AuthenticationError } from "../../errors/authentication.error";
import { UserBlockedError } from "../../errors/user-blocked.error";

export type AuthEligibility = "eligible" | "blocked" | "unverified";

type AuthenticatableUser = {
	isBlocked: boolean;
	isVerified: boolean;
};

export const getAuthEligibility = (
	user: AuthenticatableUser,
): AuthEligibility => {
	if (user.isBlocked) {
		return "blocked";
	}

	if (!user.isVerified) {
		return "unverified";
	}

	return "eligible";
};

export const assertAuthEligibility = (eligibility: AuthEligibility): void => {
	if (eligibility === "blocked") {
		throw new UserBlockedError();
	}

	if (eligibility === "unverified") {
		throw new AuthenticationError();
	}
};

export const assertUserCanAuthenticate = (user: AuthenticatableUser): void => {
	assertAuthEligibility(getAuthEligibility(user));
};

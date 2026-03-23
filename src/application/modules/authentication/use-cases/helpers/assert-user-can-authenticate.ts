import { AuthenticationError } from "../../errors/authentication.error";
import { UserBlockedError } from "../../errors/user-blocked.error";

export type AuthenticationStatus = "allowed" | "blocked" | "unverified";

export type AuthenticatableUser = {
	isBlocked: boolean;
	isVerified: boolean;
};

export const resolveAuthenticationStatus = (
	user: AuthenticatableUser,
): AuthenticationStatus => {
	if (user.isBlocked) {
		return "blocked";
	}

	if (!user.isVerified) {
		return "unverified";
	}

	return "allowed";
};

export const assertAuthenticationAllowed = (
	status: AuthenticationStatus,
): void => {
	if (status === "blocked") {
		throw new UserBlockedError();
	}

	if (status === "unverified") {
		throw new AuthenticationError();
	}
};

export const assertUserCanAuthenticate = (user: AuthenticatableUser): void => {
	assertAuthenticationAllowed(resolveAuthenticationStatus(user));
};

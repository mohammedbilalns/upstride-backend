import { AuthenticationError } from "../../errors/authentication.error";
import { UserBlockedError } from "../../errors/user-blocked.error";

type AuthenticatableUser = {
	isBlocked: boolean;
	isVerified: boolean;
};

export const assertUserCanAuthenticate = (user: AuthenticatableUser): void => {
	if (user.isBlocked) {
		throw new UserBlockedError();
	}

	if (!user.isVerified) {
		throw new AuthenticationError();
	}
};

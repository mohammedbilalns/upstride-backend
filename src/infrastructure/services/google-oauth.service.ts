import { injectable } from "inversify";
import type { SocialIdentityDto } from "../../application/authentication/dtos";
import { AuthenticationError } from "../../application/authentication/errors";
import type { IOAuthIdentityProvider } from "../../application/services";

interface GoogleUserInfoResponse {
	sub?: string;
	email?: string;
	email_verified?: boolean;
	name?: string;
	given_name?: string;
}

@injectable()
export class GoogleOAuthService implements IOAuthIdentityProvider {
	readonly provider = "GOOGLE" as const;

	async getIdentity(credential: string): Promise<SocialIdentityDto> {
		// Use the userinfo endpoint with the access token as a Bearer token
		const response = await fetch(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: {
					Authorization: `Bearer ${credential}`,
				},
			},
		);

		if (!response.ok) {
			throw new AuthenticationError();
		}

		const payload = (await response.json()) as GoogleUserInfoResponse;

		if (!payload.email) {
			throw new AuthenticationError();
		}

		if (!payload.sub) {
			throw new AuthenticationError();
		}

		return {
			email: payload.email,
			name: payload.name || payload.given_name || payload.email.split("@")[0],
			providerUserId: payload.sub,
			authType: "GOOGLE",
			isVerified: payload.email_verified ?? false,
		};
	}
}

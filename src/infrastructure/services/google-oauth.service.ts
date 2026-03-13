import { injectable } from "inversify";
import type { SocialIdentityDto } from "../../application/authentication/dtos";
import { AuthenticationError } from "../../application/authentication/errors";
import type { IOAuthIdentityProvider } from "../../application/services";
import env from "../../shared/config/env";

interface GoogleTokenInfoResponse {
	aud?: string;
	email?: string;
	email_verified?: string | boolean;
	name?: string;
	given_name?: string;
}

@injectable()
export class GoogleOAuthService implements IOAuthIdentityProvider {
	readonly provider = "GOOGLE" as const;

	async getIdentity(credential: string): Promise<SocialIdentityDto> {
		const response = await fetch(
			`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
		);

		if (!response.ok) {
			throw new AuthenticationError();
		}

		const payload = (await response.json()) as GoogleTokenInfoResponse;
		const isVerified =
			payload.email_verified === true || payload.email_verified === "true";

		if (!payload.email || !isVerified) {
			throw new AuthenticationError();
		}

		if (env.GOOGLE_CLIENT_ID && payload.aud !== env.GOOGLE_CLIENT_ID) {
			throw new AuthenticationError();
		}

		return {
			email: payload.email,
			name: payload.name || payload.given_name || payload.email.split("@")[0],
			authType: "GOOGLE",
			isVerified: true,
		};
	}
}

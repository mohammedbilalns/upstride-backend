import { injectable } from "inversify";
import type { SocialIdentityDto } from "../../application/authentication/dtos";
import { AuthenticationError } from "../../application/authentication/errors";
import type { IOAuthIdentityProvider } from "../../application/services";
import env from "../../shared/config/env";

interface LinkedInTokenResponse {
	access_token?: string;
	error?: string;
}

interface LinkedInUserInfoResponse {
	sub?: string;
	email?: string;
	name?: string;
	given_name?: string;
	family_name?: string;
	email_verified?: boolean;
}

@injectable()
export class LinkedInOAuthService implements IOAuthIdentityProvider {
	readonly provider = "LINKEDIN" as const;

	async getIdentity(credential: string): Promise<SocialIdentityDto> {
		// credential is an auth code + redirectUri separated by ::
		// Format: "code::redirectUri"
		const [code, redirectUri] = credential.split("::");

		if (!code || !redirectUri) {
			throw new AuthenticationError();
		}

		// Exchange the auth code for an access token
		const accessToken = await this._exchangeCodeForToken(code, redirectUri);

		// Use the access token to get user info
		let response: Response;
		try {
			response = await fetch("https://api.linkedin.com/v2/userinfo", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
		} catch {
			throw new AuthenticationError();
		}

		if (!response.ok) {
			throw new AuthenticationError();
		}

		const payload = (await response.json()) as LinkedInUserInfoResponse;

		if (!payload.email) {
			throw new AuthenticationError();
		}

		if (!payload.sub) {
			throw new AuthenticationError();
		}

		return {
			email: payload.email,
			name:
				payload.name ||
				[payload.given_name, payload.family_name].filter(Boolean).join(" ") ||
				payload.email.split("@")[0],
			providerUserId: payload.sub,
			authType: "LINKEDIN",
			isVerified: payload.email_verified ?? true,
		};
	}

	private async _exchangeCodeForToken(
		code: string,
		redirectUri: string,
	): Promise<string> {
		const clientId = env.LINKEDIN_CLIENT_ID;
		const clientSecret = env.LINKEDIN_CLIENT_SECRET;
		const configuredRedirectUri = env.LINKEDIN_REDIRECT_URL;

		if (!clientId || !clientSecret) {
			throw new AuthenticationError();
		}

		if (configuredRedirectUri && configuredRedirectUri !== redirectUri) {
			throw new AuthenticationError();
		}

		const resolvedRedirectUri = configuredRedirectUri || redirectUri;

		const body = new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: resolvedRedirectUri,
			client_id: clientId,
			client_secret: clientSecret,
		});

		let tokenResponse: Response;
		try {
			tokenResponse = await fetch(
				"https://www.linkedin.com/oauth/v2/accessToken",
				{
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: body.toString(),
				},
			);
		} catch {
			throw new AuthenticationError();
		}

		if (!tokenResponse.ok) {
			throw new AuthenticationError();
		}

		const tokenData = (await tokenResponse.json()) as LinkedInTokenResponse;

		if (!tokenData.access_token) {
			throw new AuthenticationError();
		}

		return tokenData.access_token;
	}
}

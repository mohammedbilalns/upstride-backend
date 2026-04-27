import { injectable } from "inversify";
import type { SocialIdentityDto } from "../../application/modules/authentication/dtos";
import {
	AuthenticationError,
	OAuthProviderError,
} from "../../application/modules/authentication/errors";
import type { IOAuthIdentityProvider } from "../../application/services";
import env from "../../shared/config/env";
import { fetchWithDiagnostics } from "../../shared/utilities/outbound-fetch.util";

interface GoogleTokenResponse {
	access_token?: string;
}

interface GoogleUserInfoResponse {
	sub?: string;
	email?: string;
	email_verified?: boolean;
	name?: string;
	given_name?: string;
}

@injectable()
// Exchanges Google auth codes for normalized social identity data.
export class GoogleOAuthService implements IOAuthIdentityProvider {
	readonly provider = "GOOGLE" as const;

	async getIdentity(credential: string): Promise<SocialIdentityDto> {
		const accessToken = await this._exchangeCodeForToken(credential);

		let response: Response;
		try {
			response = await fetchWithDiagnostics({
				service: "google.userinfo",
				url: "https://www.googleapis.com/oauth2/v3/userinfo",
				init: {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			});
		} catch {
			throw new OAuthProviderError();
		}

		if (!response.ok) {
			throw this._handleProviderResponse(response);
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

	private async _exchangeCodeForToken(code: string): Promise<string> {
		const clientId = env.GOOGLE_CLIENT_ID;
		const clientSecret = env.GOOGLE_CLIENT_SECRET;

		if (!clientId || !clientSecret) {
			throw new AuthenticationError();
		}

		const body = new URLSearchParams({
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: "postmessage",
			grant_type: "authorization_code",
		});

		let tokenResponse: Response;
		try {
			tokenResponse = await fetchWithDiagnostics({
				service: "google.access-token",
				url: "https://oauth2.googleapis.com/token",
				init: {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: body.toString(),
				},
			});
		} catch {
			throw new OAuthProviderError();
		}

		if (!tokenResponse.ok) {
			throw this._handleProviderResponse(tokenResponse);
		}

		const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

		if (!tokenData.access_token) {
			throw new AuthenticationError();
		}

		return tokenData.access_token;
	}

	private _handleProviderResponse(
		response: Response,
	): AuthenticationError | OAuthProviderError {
		if (response.status >= 500) {
			return new OAuthProviderError();
		}

		return new AuthenticationError();
	}
}

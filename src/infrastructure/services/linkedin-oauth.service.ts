import { injectable } from "inversify";
import type { SocialIdentityDto } from "../../application/authentication/dtos";
import { AuthenticationError } from "../../application/authentication/errors";
import type { IOAuthIdentityProvider } from "../../application/services";

interface LinkedInUserInfoResponse {
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
		const response = await fetch("https://api.linkedin.com/v2/userinfo", {
			headers: {
				Authorization: `Bearer ${credential}`,
			},
		});

		if (!response.ok) {
			throw new AuthenticationError();
		}

		const payload = (await response.json()) as LinkedInUserInfoResponse;

		if (!payload.email) {
			throw new AuthenticationError();
		}

		return {
			email: payload.email,
			name:
				payload.name ||
				[payload.given_name, payload.family_name].filter(Boolean).join(" ") ||
				payload.email.split("@")[0],
			authType: "LINKEDIN",
			isVerified: payload.email_verified ?? true,
		};
	}
}

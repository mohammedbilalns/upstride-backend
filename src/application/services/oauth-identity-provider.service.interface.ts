import type { OAuthProvider, SocialIdentityDto } from "../authentication/dtos";

export interface IOAuthIdentityProvider {
	readonly provider: OAuthProvider;
	getIdentity(credential: string): Promise<SocialIdentityDto>;
}

import type { AuthType } from "../../../../domain/entities/user.entity";
import type {
	LoginResponse,
	LoginWithEmailInput,
} from "./login-with-email.dto";

export type AuthDeviceContext = Omit<LoginWithEmailInput, "email" | "password">;
export type OAuthProvider = Exclude<AuthType, "LOCAL">;

export interface SocialIdentityDto {
	email: string;
	name: string;
	authType: OAuthProvider;
	isVerified: boolean;
}

export interface SocialLoginInput extends AuthDeviceContext {
	provider: OAuthProvider;
	credential: string;
}

export type SocialLoginResponse = LoginResponse;

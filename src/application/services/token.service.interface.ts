import type { UserRole } from "../../domain/entities/user.entity";

export interface AccessTokenPayload {
	sub: string;
	sid: string;
	role: UserRole;
	jti: string;
}

export interface RefreshTokenPayload {
	sub: string;
	sid: string;
	jti: string;
}

export interface ResetTokenPayload {
	sub: string;
}

export interface SetupTokenPayload {
	sub: string;
}

export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";
export const RESET_TOKEN_EXPIRES_IN = "15m";
export const SETUP_TOKEN_EXPIRES_IN = "30m";
export const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

export interface ITokenService {
	generateAccessToken(payload: AccessTokenPayload): Promise<string>;
	generateRefreshToken(payload: RefreshTokenPayload): Promise<string>;
	generateResetToken(payload: ResetTokenPayload): Promise<string>;
	generateSetupToken(payload: SetupTokenPayload): Promise<string>;
	verifyAccessToken(token: string): Promise<AccessTokenPayload>;
	verifyRefreshToken(token: string): Promise<RefreshTokenPayload>;
	verifyResetToken(token: string): Promise<ResetTokenPayload>;
	verifySetupToken(token: string): Promise<SetupTokenPayload>;
	hashToken(token: string): string;
}

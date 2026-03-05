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

export const ACCESS_TOKEN_EXPIRES_IN = 15 * 60;
export const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60;
export const RESET_TOKEN_EXPIRES_IN = 15 * 60;
export const SETUP_TOKEN_EXPIRES_IN = 30 * 60;

export interface ITokenService {
	generateAccessToken(payload: AccessTokenPayload): string;
	generateRefreshToken(payload: RefreshTokenPayload): string;
	generateResetToken(payload: ResetTokenPayload): string;
	generateSetupToken(payload: SetupTokenPayload): string;
	verifyAccessToken(token: string): AccessTokenPayload;
	verifyRefreshToken(token: string): RefreshTokenPayload;
	verifyResetToken(token: string): ResetTokenPayload;
	verifySetupToken(token: string): SetupTokenPayload;
	hashToken(token: string): string;
}

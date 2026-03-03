import type { UserRole } from "../../domain/entities/user.entity";

export interface AccessTokenPayload {
	sub: string;
	role: UserRole;
}

export interface RefreshTokenPayload {
	sub: string;
	jti: string;
}

export interface ResetTokenPayload {
	sub: string;
}

export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";
export const RESET_TOKEN_EXPIRES_IN = "15m";

export interface ITokenService {
	generateAccessToken(payload: AccessTokenPayload): string;
	generateRefreshToken(payload: RefreshTokenPayload): string;
	verifyAccessToken(token: string): AccessTokenPayload;
	verifyRefreshToken(token: string): RefreshTokenPayload;
	generateResetToken(payload: ResetTokenPayload): string;
	verifyResetToken(token: string): ResetTokenPayload;
}

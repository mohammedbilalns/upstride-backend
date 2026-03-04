import { createHmac } from "node:crypto";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import {
	ACCESS_TOKEN_EXPIRES_IN,
	type AccessTokenPayload,
	type ITokenService,
	REFRESH_TOKEN_EXPIRES_IN,
	RESET_TOKEN_EXPIRES_IN,
	type RefreshTokenPayload,
	type ResetTokenPayload,
	SETUP_TOKEN_EXPIRES_IN,
	type SetupTokenPayload,
} from "../../application/services/token.service.interace";
import env from "../../shared/config/env";

@injectable()
export class JwtTokenService implements ITokenService {
	generateAccessToken(payload: AccessTokenPayload): string {
		return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
			expiresIn: ACCESS_TOKEN_EXPIRES_IN,
		});
	}

	generateRefreshToken(payload: RefreshTokenPayload): string {
		return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
			expiresIn: REFRESH_TOKEN_EXPIRES_IN,
		});
	}

	generateResetToken(payload: ResetTokenPayload): string {
		return jwt.sign(payload, env.JWT_RESET_SECRET, {
			expiresIn: RESET_TOKEN_EXPIRES_IN,
		});
	}

	generateSetupToken(payload: SetupTokenPayload): string {
		return jwt.sign(payload, env.JWT_SETUP_SECRET, {
			expiresIn: SETUP_TOKEN_EXPIRES_IN,
		});
	}

	verifyAccessToken(token: string): AccessTokenPayload {
		return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
	}

	verifyRefreshToken(token: string): RefreshTokenPayload {
		return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
	}

	verifyResetToken(token: string): ResetTokenPayload {
		return jwt.verify(token, env.JWT_RESET_SECRET) as ResetTokenPayload;
	}

	verifySetupToken(token: string): SetupTokenPayload {
		return jwt.verify(token, env.JWT_SETUP_SECRET) as SetupTokenPayload;
	}

	hashToken(token: string): string {
		return createHmac("sha256", env.JWT_REFRESH_SECRET)
			.update(token)
			.digest("hex");
	}
}

import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import {
	ACCESS_TOKEN_EXPIRES_IN,
	type AccessTokenPayload,
	type ITokenService,
	REFRESH_TOKEN_EXPIRES_IN,
	type RefreshTokenPayload,
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

	verifyAccessToken(token: string): AccessTokenPayload {
		return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
	}

	verifyRefreshToken(token: string): RefreshTokenPayload {
		return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
	}
}

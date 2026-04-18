import { createHmac } from "node:crypto";
import { injectable } from "inversify";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";
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
} from "../../application/services";
import env from "../../shared/config/env";

@injectable()
export class JwtTokenService implements ITokenService {
	constructor(
		private _accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET),
		private _refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET),
		private _resetSecret = new TextEncoder().encode(env.JWT_RESET_SECRET),
		private _setupSecret = new TextEncoder().encode(env.JWT_SETUP_SECRET),
	) {}

	private async sign<T extends object>(
		payload: T,
		secret: Uint8Array,
		expiresIn: string,
	): Promise<string> {
		const jwtPayload = { ...payload } as unknown as JWTPayload;

		return await new SignJWT(jwtPayload)
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime(expiresIn)
			.sign(secret);
	}

	private async verify<T>(token: string, secret: Uint8Array): Promise<T> {
		const { payload } = await jwtVerify(token, secret);
		return payload as T;
	}

	async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
		return this.sign(payload, this._accessSecret, ACCESS_TOKEN_EXPIRES_IN);
	}

	async generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
		return this.sign(payload, this._refreshSecret, REFRESH_TOKEN_EXPIRES_IN);
	}

	async generateResetToken(payload: ResetTokenPayload): Promise<string> {
		return this.sign(payload, this._resetSecret, RESET_TOKEN_EXPIRES_IN);
	}

	async generateSetupToken(payload: SetupTokenPayload): Promise<string> {
		return this.sign(payload, this._setupSecret, SETUP_TOKEN_EXPIRES_IN);
	}

	async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
		return this.verify<AccessTokenPayload>(token, this._accessSecret);
	}

	async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
		return this.verify<RefreshTokenPayload>(token, this._refreshSecret);
	}

	async verifyResetToken(token: string): Promise<ResetTokenPayload> {
		return this.verify<ResetTokenPayload>(token, this._resetSecret);
	}

	async verifySetupToken(token: string): Promise<SetupTokenPayload> {
		return this.verify(token, this._setupSecret);
	}

	hashToken(token: string): string {
		return createHmac("sha256", env.JWT_REFRESH_SECRET)
			.update(token)
			.digest("hex");
	}
}

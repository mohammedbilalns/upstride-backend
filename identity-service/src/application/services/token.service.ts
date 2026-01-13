import jwt from "jsonwebtoken";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { ITokenService } from "../../domain/services";
import env from "../../infrastructure/config/env";
import type { UserDTO } from "../dtos";
import { AppError } from "../errors/app-error";

export interface GoogleTokenPayload {
	email: string;
	name: string;
	picture: string;
	sub: string;
}

export class TokenService implements ITokenService {
	constructor(private jwtSecret: string) {}

	public generateAccessToken(user: UserDTO): string {
		return jwt.sign(
			{
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				type: "access",
				mentorId: user.mentorId,
			},
			this.jwtSecret,
			{ expiresIn: parseInt(env.ACCESS_TOKEN_EXPIRY) },
		);
	}

	public generateRefreshToken(user: UserDTO): string {
		return jwt.sign(
			{
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				type: "refresh",
			},
			this.jwtSecret,
			{ expiresIn: parseInt(env.REFRESH_TOKEN_EXPIRY) },
		);
	}

	public verifyRefreshToken(token: string): {
		id: string;
		email: string;
		role: string;
	} {
		const decoded = jwt.verify(token, this.jwtSecret) as {
			id: string;
			email: string;
			role: string;
			type: string;
		};
		if (decoded.type !== "refresh") {
			throw new AppError(
				ErrorMessage.INVALID_TOKEN_TYPE,
				HttpStatus.UNAUTHORIZED,
			);
		}
		return decoded;
	}

	public decodeGoogleToken(token: string): {
		sub: string;
		email: string;
		name: string;
		picture: string;
	} {
		return jwt.decode(token) as GoogleTokenPayload;
	}

	public async generateTokens(
		user: UserDTO,
	): Promise<{ newAccessToken: string; newRefreshToken: string }> {
		const [newAccessToken, newRefreshToken] = await Promise.all([
			this.generateAccessToken(user),
			this.generateRefreshToken(user),
		]);
		return { newAccessToken, newRefreshToken };
	}
}

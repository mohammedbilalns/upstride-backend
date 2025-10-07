import jwt from "jsonwebtoken";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { ITokenService } from "../../domain/services";
import env from "../../infrastructure/config/env";
import type { UserDTO } from "../dtos";
import { AppError } from "../errors/AppError";

export interface GoogleTokenPayload {
	email: string;
	name: string;
	picture: string;
	sub: string;
}

export class TokenService implements ITokenService {
	constructor(private jwtSecret: string) {}

	generateAccessToken(user: UserDTO): string {
		return jwt.sign(
			{ id: user.id, email: user.email, role: user.role, type: "access" },
			this.jwtSecret,
			{ expiresIn: parseInt(env.ACCESS_TOKEN_EXPIRY) },
		);
	}

	generateRefreshToken(user: UserDTO): string {
		return jwt.sign(
			{ id: user.id, email: user.email, role: user.role, type: "refresh" },
			this.jwtSecret,
			{ expiresIn: parseInt(env.REFRESH_TOKEN_EXPIRY) },
		);
	}

	verifyAccessToken(token: string): {
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
		if (decoded.type !== "access") {
			throw new AppError(
				ErrorMessage.INVALID_TOKEN_TYPE,
				HttpStatus.UNAUTHORIZED,
			);
		}
		return decoded;
	}

	verifyRefreshToken(token: string): {
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
	decodeGoogleToken(token: string): {
		sub: string;
		email: string;
		name: string;
		picture: string;
	} {
		return jwt.decode(token) as GoogleTokenPayload;
	}
}

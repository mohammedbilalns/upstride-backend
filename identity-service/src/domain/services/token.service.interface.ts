import type { UserDTO } from "../../application/dtos";

export interface ITokenService {
	generateAccessToken(user: UserDTO): string;
	generateRefreshToken(user: UserDTO): string;
	verifyAccessToken(token: string): { id: string; email: string; role: string };
	verifyRefreshToken(token: string): {
		id: string;
		email: string;
		role: string;
	};
	decodeGoogleToken(token: string): {
		sub: string;
		email: string;
		name: string;
		picture: string;
	};
	generateTokens(
		user: UserDTO,
	): Promise<{ newAccessToken: string; newRefreshToken: string }>;
}

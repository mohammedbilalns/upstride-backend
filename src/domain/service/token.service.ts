export interface AuthTokenSubject {
	userId: string;
	role: string;
}

export interface AuthTokenPayload extends AuthTokenSubject {
	exp: number;
}

export interface ITokenService {
	generateAccessToken(payload: AuthTokenSubject): string;
	generateRefreshToken(payload: AuthTokenSubject): string;
	verifyAccessToken(token: string): AuthTokenPayload;
	verifyRefreshToken(token: string): AuthTokenPayload;
}

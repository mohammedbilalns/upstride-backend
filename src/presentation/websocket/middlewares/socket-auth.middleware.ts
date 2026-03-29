import type { Socket } from "socket.io";
import type { ITokenService } from "../../../application/services";
import type { ITokenRevocationRepository } from "../../../domain/repositories/token-revocation.repository.interface";
import { container } from "../../../main/container";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";

export type AuthedSocket = Socket & {
	data: {
		user: {
			id: string;
			role: string;
			sid: string;
		};
	};
};

/**
 * Creates a Socket.io middleware function that authenticates incoming WebSocket connections.
 * Extracts and verifies JWT token from handshake, checks token revocation status,
 * and attaches user info to the socket for use in subsequent handlers.
 */
export const socketAuthMiddleware = async (
	socket: Socket,
	next: (err?: Error) => void,
) => {
	try {
		const token =
			socket.handshake.auth.token ||
			socket.handshake.headers.authorization?.split(" ")[1];

		if (!token) {
			return next(new Error("Authentication error: Token missing"));
		}

		const tokenService = container.get<ITokenService>(
			TYPES.Services.TokenService,
		);
		const tokenRevocationRepository = container.get<ITokenRevocationRepository>(
			TYPES.Repositories.TokenRevocationRepository,
		);

		const payload = tokenService.verifyAccessToken(token);
		const isRevoked = await tokenRevocationRepository.isSessionRevoked(
			payload.sid,
		);

		if (isRevoked) {
			return next(new Error("Authentication error: Session revoked"));
		}

		const authedSocket = socket as AuthedSocket;
		authedSocket.data.user = {
			id: payload.sub,
			role: payload.role,
			sid: payload.sid,
		};

		next();
	} catch (error) {
		logger.error(`WebSocket Auth Error: ${error}`);
		next(new Error("Authentication error: Invalid token"));
	}
};

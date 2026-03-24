import type { Server as HTTPServer } from "node:http";
import { inject, injectable } from "inversify";
import { Server as SocketIOServer } from "socket.io";
import type { ITokenService } from "../../application/services";
import type { ITokenRevocationRepository } from "../../domain/repositories/token-revocation.repository.interface";
import logger from "../../shared/logging/logger";
import { TYPES } from "../../shared/types/types";

@injectable()
export class WebSocketServer {
	private _io: SocketIOServer | null = null;

	constructor(
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
		@inject(TYPES.Repositories.TokenRevocationRepository)
		private readonly _tokenRevocationRepository: ITokenRevocationRepository,
	) {}

	/**
	 * Initializes the Socket.io server and attaches it to the HTTP server.
	 */
	public initialize(httpServer: HTTPServer): void {
		this._io = new SocketIOServer(httpServer, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
		});

		// JWT Authentication Middleware
		this._io.use(async (socket, next) => {
			try {
				const token =
					socket.handshake.auth.token ||
					socket.handshake.headers.authorization?.split(" ")[1];

				if (!token) {
					return next(new Error("Authentication error: Token missing"));
				}

				const payload = this._tokenService.verifyAccessToken(token);
				const isRevoked =
					await this._tokenRevocationRepository.isSessionRevoked(payload.sid);

				if (isRevoked) {
					return next(new Error("Authentication error: Session revoked"));
				}

				// Attach user info to socket
				(socket as any).user = {
					id: payload.sub,
					role: payload.role,
					sid: payload.sid,
				};

				next();
			} catch (error) {
				logger.error(`WebSocket Auth Error: ${error}`);
				next(new Error("Authentication error: Invalid token"));
			}
		});

		this._setupHandlers();
		logger.info("WebSocket Server initialized");
	}

	private _setupHandlers(): void {
		if (!this._io) return;

		this._io.on("connection", (socket) => {
			const user = (socket as any).user;
			const userId = user.id;

			logger.info(`User connected: ${userId} (${socket.id})`);

			socket.join(userId);

			socket.on("disconnect", () => {
				logger.info(`User disconnected: ${userId} (${socket.id})`);
			});
		});
	}

	/**
	 * Broadcasts an event to a specific user's room.
	 */
	public emitToUser(userId: string, event: string, payload: any): void {
		if (!this._io) {
			logger.warn("Attempted to emit to user but IO is not initialized");
			return;
		}
		this._io.to(userId).emit(event, payload);
	}

	public get io(): SocketIOServer | null {
		return this._io;
	}
}

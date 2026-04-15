import { inject, injectable } from "inversify";
import type {
	WebRTCAnswerPayload,
	WebRTCIceCandidatePayload,
	WebRTCOfferPayload,
} from "../../../application/modules/call-management/call-events.interface";
import type { IAuthorizeWhiteboardPermissionUseCase } from "../../../application/modules/live-call/usecases/authorize-whiteboard-permission.usecase.interface";
import type { IJoinSessionUseCase } from "../../../application/modules/live-call/usecases/join-session.usecase.interface";
import type { ITerminateSessionUseCase } from "../../../application/modules/live-call/usecases/terminate-session.usecase.interface";
import type { IWhiteboardCache } from "../../../application/services";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";
import { socketAsyncHandler } from "../helpers/socket-async-handler";
import type { AuthedSocket } from "../middlewares/socket-auth.middleware";
import {
	JoinCallPayloadSchema,
	LeaveCallPayloadSchema,
	TerminateSessionPayloadSchema,
	ToggledMediaPayloadSchema,
	WhiteBoardPermissionSchema,
} from "../validators/live-call.validator";

type WhiteboardElementState = Record<string, unknown>;

interface WhiteboardSyncEventPayload {
	bookingId: string;
	update: readonly WhiteboardElementState[];
}

@injectable()
export class CallHandler {
	constructor(
		@inject(TYPES.UseCases.JoinSession)
		private readonly _joinSessionUseCase: IJoinSessionUseCase,
		@inject(TYPES.UseCases.TerminateSession)
		private readonly _terminateSessionUseCase: ITerminateSessionUseCase,
		@inject(TYPES.UseCases.AuthorizeWhiteboardPermission)
		private readonly _authorizeWhiteboardPermissionUseCase: IAuthorizeWhiteboardPermissionUseCase,
		@inject(TYPES.Caches.Whiteboard)
		private readonly _whiteboardCache: IWhiteboardCache,
	) {}

	public attach(socket: AuthedSocket): void {
		const userId = socket.data.user.id;

		socket.on(
			"call:join",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = JoinCallPayloadSchema.parse(payload);

				const result = await this._joinSessionUseCase.execute({
					userId,
					bookingId: parsedPayload.bookingId,
				});

				const room = `call_${result.roomId}`;
				socket.join(room);
				logger.info(`[CallHandler] User ${userId} joined room ${room}`);

				// Notify others in the room
				socket.to(room).emit("call:user-joined", { userId });
				logger.info(
					`[CallHandler] Emitted call:user-joined to room ${room} for user ${userId}`,
				);

				// Provide initial whiteboard state if exists
				const cachedWhiteboard = await this._whiteboardCache.get(
					payload.bookingId,
				);
				if (cachedWhiteboard) {
					socket.emit("whiteboard:sync", {
						update: cachedWhiteboard,
						isInitial: true,
					});
					logger.info(
						`[CallHandler] Sent initial whiteboard state (${cachedWhiteboard.length} elements) to user ${userId} for booking ${payload.bookingId}`,
					);
				} else {
					logger.info(
						`[CallHandler] No cached whiteboard state found for booking ${payload.bookingId}`,
					);
				}
			}),
		);

		socket.on("call:leave", (payload) => {
			const parsedPayload = LeaveCallPayloadSchema.parse(payload);
			const room = `call_${parsedPayload.bookingId}`;
			socket.leave(room);
			socket.to(room).emit("call:user-left", { userId });
		});

		socket.on("call:offer", (payload: WebRTCOfferPayload) => {
			logger.info(
				`[CallHandler] Received call:offer from ${userId} for booking ${payload.bookingId}`,
			);
			socket
				.to(`call_${payload.bookingId}`)
				.emit("call:offer", { userId, offer: payload.offer });
		});

		socket.on("call:answer", (payload: WebRTCAnswerPayload) => {
			logger.info(
				`[CallHandler] Received call:answer from ${userId} for booking ${payload.bookingId}`,
			);
			socket
				.to(`call_${payload.bookingId}`)
				.emit("call:answer", { userId, answer: payload.answer });
		});

		socket.on("call:ice-candidate", (payload: WebRTCIceCandidatePayload) => {
			logger.info(
				`[CallHandler] Received call:ice-candidate from ${userId} for booking ${payload.bookingId}`,
			);
			socket.to(`call_${payload.bookingId}`).emit("call:ice-candidate", {
				userId,
				candidate: payload.candidate,
			});
		});

		socket.on("call:toggled-media", (payload) => {
			const parsedPayload = ToggledMediaPayloadSchema.parse(payload);
			socket.to(`call_${parsedPayload.bookingId}`).emit("call:toggled-media", {
				userId,
				mediaType: parsedPayload.mediaType,
				isEnabled: parsedPayload.isEnabled,
			});
		});

		socket.on(
			"whiteboard:sync",
			socketAsyncHandler(async (payload: WhiteboardSyncEventPayload) => {
				// Persist state in Redis
				await this._whiteboardCache.set(payload.bookingId, payload.update);

				socket
					.to(`call_${payload.bookingId}`)
					.emit("whiteboard:sync", { userId, update: payload.update });
			}),
		);

		socket.on(
			"whiteboard:permission",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = WhiteBoardPermissionSchema.parse(payload);

				await this._authorizeWhiteboardPermissionUseCase.execute({
					userId,
					bookingId: parsedPayload.bookingId,
				});

				socket
					.to(`call_${parsedPayload.bookingId}`)
					.emit("whiteboard:permission", parsedPayload);
			}),
		);

		socket.on(
			"call:terminate",
			socketAsyncHandler(async (payload: { bookingId: string }) => {
				const parsedPayload = TerminateSessionPayloadSchema.parse(payload);
				await this._terminateSessionUseCase.execute({
					userId,
					bookingId: parsedPayload.bookingId,
				});

				socket
					.to(`call_${payload.bookingId}`)
					.emit("call:terminated", { bookingId: payload.bookingId });
			}),
		);
	}
}

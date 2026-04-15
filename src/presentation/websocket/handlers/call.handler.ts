import { inject, injectable } from "inversify";
import type { IAuthorizeWhiteboardPermissionUseCase } from "../../../application/modules/live-call/usecases/authorize-whiteboard-permission.usecase.interface";
import type { IJoinSessionUseCase } from "../../../application/modules/live-call/usecases/join-session.usecase.interface";
import type { ITerminateSessionUseCase } from "../../../application/modules/live-call/usecases/terminate-session.usecase.interface";
import type { IValidateJoinSessionUseCase } from "../../../application/modules/live-call/usecases/validate-join-session.usecase.interface";
import type { IWhiteboardCache } from "../../../application/services";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";
import { socketAsyncHandler } from "../helpers/socket-async-handler";
import type { AuthedSocket } from "../middlewares/socket-auth.middleware";
import {
	ChatMessagePayloadSchema,
	JoinCallPayloadSchema,
	LeaveCallPayloadSchema,
	TerminateSessionPayloadSchema,
	ToggledMediaPayloadSchema,
	WebRTCAnswerPayloadSchema,
	WebRTCIceCandidatePayloadSchema,
	WebRTCOfferPayloadSchema,
	WhiteBoardPermissionSchema,
	WhiteboardSyncPayloadSchema,
} from "../validators/live-call.validator";

@injectable()
export class CallHandler {
	constructor(
		@inject(TYPES.UseCases.JoinSession)
		private readonly _joinSessionUseCase: IJoinSessionUseCase,
		@inject(TYPES.UseCases.TerminateSession)
		private readonly _terminateSessionUseCase: ITerminateSessionUseCase,
		@inject(TYPES.UseCases.ValidateJoinSession)
		private readonly _validateJoinSessionUseCase: IValidateJoinSessionUseCase,
		@inject(TYPES.UseCases.AuthorizeWhiteboardPermission)
		private readonly _authorizeWhiteboardPermissionUseCase: IAuthorizeWhiteboardPermissionUseCase,
		@inject(TYPES.Caches.Whiteboard)
		private readonly _whiteboardCache: IWhiteboardCache,
	) {}

	public attach(socket: AuthedSocket): void {
		const userId = socket.data.user.id;

		socket.on("disconnecting", () => {
			for (const room of socket.rooms) {
				if (room.startsWith("call_")) {
					socket.to(room).emit("call:user-left", { userId });
				}
			}
		});

		socket.on(
			"call:pre-join-check",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = JoinCallPayloadSchema.parse(payload);
				await this._validateJoinSessionUseCase.execute({
					userId,
					bookingId: parsedPayload.bookingId,
				});

				socket.emit("call:pre-join-check:success", {
					bookingId: parsedPayload.bookingId,
				});
			}),
		);

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

				// Notify other user  in the room
				socket.to(room).emit("call:user-joined", { userId });
				logger.info(
					`[CallHandler] Emitted call:user-joined to room ${room} for user ${userId}`,
				);

				// Provide initial whiteboard state if exists
				const cachedWhiteboard = await this._whiteboardCache.get(
					parsedPayload.bookingId,
				);
				if (cachedWhiteboard) {
					socket.emit("whiteboard:sync", {
						update: cachedWhiteboard,
						isInitial: true,
					});
					logger.info(
						`[CallHandler] Sent initial whiteboard state (${cachedWhiteboard.length} elements) to user ${userId} for booking ${parsedPayload.bookingId}`,
					);
				} else {
					logger.info(
						`[CallHandler] No cached whiteboard state found for booking ${parsedPayload.bookingId}`,
					);
				}
			}),
		);

		socket.on(
			"call:leave",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = LeaveCallPayloadSchema.parse(payload);
				const room = `call_${parsedPayload.bookingId}`;
				socket.leave(room);
				socket.to(room).emit("call:user-left", { userId });
			}),
		);

		socket.on(
			"call:offer",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = WebRTCOfferPayloadSchema.parse(payload);
				logger.info(
					`[CallHandler] Received call:offer from ${userId} for booking ${parsedPayload.bookingId}`,
				);
				socket.to(`call_${parsedPayload.bookingId}`).emit("call:offer", {
					userId,
					offer: parsedPayload.offer,
				});
			}),
		);

		socket.on(
			"call:answer",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = WebRTCAnswerPayloadSchema.parse(payload);
				logger.info(
					`[CallHandler] Received call:answer from ${userId} for booking ${parsedPayload.bookingId}`,
				);
				socket.to(`call_${parsedPayload.bookingId}`).emit("call:answer", {
					userId,
					answer: parsedPayload.answer,
				});
			}),
		);

		socket.on(
			"call:ice-candidate",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = WebRTCIceCandidatePayloadSchema.parse(payload);
				logger.info(
					`[CallHandler] Received call:ice-candidate from ${userId} for booking ${parsedPayload.bookingId}`,
				);
				socket
					.to(`call_${parsedPayload.bookingId}`)
					.emit("call:ice-candidate", {
						userId,
						candidate: parsedPayload.candidate,
					});
			}),
		);

		socket.on(
			"call:toggled-media",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = ToggledMediaPayloadSchema.parse(payload);
				socket
					.to(`call_${parsedPayload.bookingId}`)
					.emit("call:toggled-media", {
						userId,
						mediaType: parsedPayload.mediaType,
						isEnabled: parsedPayload.isEnabled,
					});
			}),
		);

		socket.on(
			"whiteboard:sync",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = WhiteboardSyncPayloadSchema.parse(payload);
				// Persist state in Redis
				await this._whiteboardCache.set(
					parsedPayload.bookingId,
					parsedPayload.update,
				);

				socket.to(`call_${parsedPayload.bookingId}`).emit("whiteboard:sync", {
					userId,
					update: parsedPayload.update,
				});
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

				socket.emit("call:terminated", {
					bookingId: parsedPayload.bookingId,
				});
				socket.to(`call_${parsedPayload.bookingId}`).emit("call:terminated", {
					bookingId: parsedPayload.bookingId,
				});
			}),
		);

		socket.on(
			"call:chat-message",
			socketAsyncHandler(async (payload) => {
				const parsedPayload = ChatMessagePayloadSchema.parse(payload);
				const room = `call_${parsedPayload.bookingId}`;

				logger.info(
					`[CallHandler] Received call:chat-message from ${userId} in room ${room}`,
				);

				socket.to(room).emit("call:chat-message", {
					senderId: userId,
					message: parsedPayload.message,
					timestamp: new Date().toISOString(),
				});
			}),
		);
	}
}

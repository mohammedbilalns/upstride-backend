import { inject, injectable } from "inversify";
import type { IWhiteboardCache } from "../../../application/services";
import type { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";
import type { AuthedSocket } from "../middlewares/socket-auth.middleware";

@injectable()
export class CallHandler {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Caches.Whiteboard)
		private readonly _whiteboardCache: IWhiteboardCache,
	) {}

	public attach(socket: AuthedSocket): void {
		const userId = socket.data.user.id;

		socket.on("call:join", async (payload: { bookingId: string }) => {
			const booking = await this._bookingRepository.findById(payload.bookingId);
			if (
				!booking ||
				(booking.mentorUserId !== userId && booking.menteeId !== userId)
			) {
				logger.warn(
					`[CallHandler] Unauthorized participation attempt by user ${userId} for booking ${payload.bookingId}`,
				);
				socket.emit("call:error", {
					message: "Unauthorized: You are not a participant of this session.",
				});
				return;
			}

			const room = `call_${payload.bookingId}`;
			socket.join(room);
			logger.info(`[CallHandler] User ${userId} joined room ${room}`);

			// Notify others in the room
			socket.to(room).emit("call:user-joined", { userId });
			logger.info(
				`[CallHandler] Emitted call:user-joined to room ${room} for user ${userId}`,
			);

			// Provide initial whiteboard state if exists
			try {
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
			} catch (error) {
				logger.error(
					`[CallHandler] Error fetching whiteboard state from Redis: ${error}`,
				);
			}
		});

		socket.on("call:leave", (payload: { bookingId: string }) => {
			const room = `call_${payload.bookingId}`;
			socket.leave(room);
			socket.to(room).emit("call:user-left", { userId });
		});

		socket.on("call:offer", (payload: { bookingId: string; offer: any }) => {
			logger.info(
				`[CallHandler] Received call:offer from ${userId} for booking ${payload.bookingId}`,
			);
			socket
				.to(`call_${payload.bookingId}`)
				.emit("call:offer", { userId, offer: payload.offer });
		});

		socket.on("call:answer", (payload: { bookingId: string; answer: any }) => {
			logger.info(
				`[CallHandler] Received call:answer from ${userId} for booking ${payload.bookingId}`,
			);
			socket
				.to(`call_${payload.bookingId}`)
				.emit("call:answer", { userId, answer: payload.answer });
		});

		socket.on(
			"call:ice-candidate",
			(payload: { bookingId: string; candidate: any }) => {
				logger.info(
					`[CallHandler] Received call:ice-candidate from ${userId} for booking ${payload.bookingId}`,
				);
				socket.to(`call_${payload.bookingId}`).emit("call:ice-candidate", {
					userId,
					candidate: payload.candidate,
				});
			},
		);

		socket.on(
			"call:toggled-media",
			(payload: {
				bookingId: string;
				mediaType: string;
				isEnabled: boolean;
			}) => {
				socket.to(`call_${payload.bookingId}`).emit("call:toggled-media", {
					userId,
					mediaType: payload.mediaType,
					isEnabled: payload.isEnabled,
				});
			},
		);

		socket.on(
			"whiteboard:sync",
			async (payload: { bookingId: string; update: any }) => {
				try {
					// Persist state in Redis
					await this._whiteboardCache.set(payload.bookingId, payload.update);

					socket
						.to(`call_${payload.bookingId}`)
						.emit("whiteboard:sync", { userId, update: payload.update });
				} catch (error) {
					logger.error(
						`[CallHandler] Error saving whiteboard to Redis: ${error}`,
					);
				}
			},
		);

		socket.on(
			"whiteboard:permission",
			(payload: { bookingId: string; menteeId: string; allow: boolean }) => {
				//TODO: check if userId === booking.mentorId
				socket
					.to(`call_${payload.bookingId}`)
					.emit("whiteboard:permission", payload);
			},
		);

		socket.on("call:terminate", async (payload: { bookingId: string }) => {
			const booking = await this._bookingRepository.findById(payload.bookingId);
			if (!booking || booking.mentorId !== userId) {
				return; // Only mentor can terminate
			}

			const now = new Date().getTime();
			const end = new Date(booking.endTime).getTime();
			const diffMins = Math.abs((now - end) / 1000 / 60);

			if (diffMins <= 5 && booking.status !== "COMPLETED") {
				await this._bookingRepository.updateById(booking.id, {
					status: "COMPLETED",
				});
				logger.info(
					`Booking ${booking.id} automatically completed on termination.`,
				);
			}

			socket
				.to(`call_${payload.bookingId}`)
				.emit("call:terminated", { bookingId: booking.id });
		});
	}
}

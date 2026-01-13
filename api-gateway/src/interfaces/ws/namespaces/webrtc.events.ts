import type { Server, Socket } from "socket.io";
import { SocketEvents } from "../../../common/enums/socket-events";
import logger from "../../../utils/logger";
import type { SocketPublisher } from "../socket.publisher";

export function registerWebRTCEvents(
	_io: Server,
	socket: Socket,
	_publisher: SocketPublisher,
) {
	socket.on(SocketEvents.JOIN_ROOM, (roomId: string) => {
		socket.join(roomId);
		logger.info(`[WS] User ${socket.data.user.id} joined room ${roomId}`);
		socket.to(roomId).emit("user_joined", { userId: socket.data.user.id });
	});

	socket.on(SocketEvents.OFFER, (data: { roomId: string; offer: any }) => {
		logger.info(
			`[WS] Offer from ${socket.data.user.id} to room ${data.roomId}`,
		);
		socket.to(data.roomId).emit(SocketEvents.OFFER, {
			offer: data.offer,
			senderId: socket.data.user.id,
		});
	});

	socket.on(SocketEvents.ANSWER, (data: { roomId: string; answer: any }) => {
		logger.info(
			`[WS] Answer from ${socket.data.user.id} to room ${data.roomId}`,
		);
		socket.to(data.roomId).emit(SocketEvents.ANSWER, {
			answer: data.answer,
			senderId: socket.data.user.id,
		});
	});

	socket.on(
		SocketEvents.ICE_CANDIDATE,
		(data: { roomId: string; candidate: any }) => {
			socket.to(data.roomId).emit(SocketEvents.ICE_CANDIDATE, {
				candidate: data.candidate,
				senderId: socket.data.user.id,
			});
		},
	);

	socket.on(
		SocketEvents.MEDIA_STATUS,
		(data: { roomId: string; type: "audio" | "video"; enabled: boolean }) => {
			socket.to(data.roomId).emit(SocketEvents.MEDIA_STATUS, {
				type: data.type,
				enabled: data.enabled,
				userId: socket.data.user.id,
			});
		},
	);
}

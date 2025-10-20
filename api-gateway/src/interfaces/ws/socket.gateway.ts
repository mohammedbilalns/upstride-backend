import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import env from "../../infra/config/env";
import logger from "../../utils/logger";
import { socketAuthMiddleware } from "./middlewares/socket.middleware";
import { IEventBus } from "../../domain/events/eventBus.interface";
import { SocketPublisher } from "./socket.publisher";
import { registerChatEvents, registerWebRTCEvents, registerNotificationEvents } from "./namespaces";
import { registerNotificationSubscriber } from "./subscribers";

/**
 * Initializes the Socket.IO server and binds all real-time event namespaces.
 * This acts as the gateway for all WebSocket connections.
 *
 * Responsibilities:
 * - Authenticate socket connections
 * - Register namespace-specific event handlers
 * - Maintain mapping between users and their active sockets
 * - Integrate with the event bus for microservice communication
 */

export function initSocket(server:HttpServer,eventBus: IEventBus ) {

	logger.info("[WS] Initializing Socket.IO server...");

	const io = new Server(server, {
		cors: { origin: env.CLIENT_URL, credentials: true },
	});

	// publisheer for emitting socket events and publishing messages to RabbitMQ
	const socketPublisher = new SocketPublisher(io,eventBus)
	/**
	 * userSockets map maintains a relationship between
	 * userId -> Set of socket IDs (a user can have multiple active tabs/devices)
	 */
	const userSockets = new Map<string, Set<string>>();

	// Register event bus subscribers that need to trigger socket events
	registerNotificationSubscriber(eventBus,socketPublisher)

	// Authenticate socket connections
	io.use(socketAuthMiddleware);

	io.on("connection", (socket) => {
		const userId = socket.data.user.id;

		// Add socket to user’s active connection pool
		if (!userSockets.has(userId)) userSockets.set(userId, new Set());
		userSockets.get(userId)?.add(socket.id);
		logger.info(`[WS] Connected: socket.id=${socket.id}, userId=${userId}`);

		socket.join(userId);

		/**
		 * Register namespace-specific event handlers
		 */
		registerChatEvents(io,socket,socketPublisher)
		registerNotificationEvents(io,socket,socketPublisher)
		registerWebRTCEvents(io,socket,socketPublisher)


		/**
		 * When a user disconnects:
		 * - Remove the socket from the user's active socket set
		 * - If no active sockets remain for that user, delete the entry entirely
		 */
		socket.on("disconnect", () => {
			logger.info(`[WS] Disconnected: userId=${userId}`);
			userSockets.get(userId)?.delete(socket.id);
			if (userSockets.get(userId)?.size === 0) {
				userSockets.delete(userId);
			}
		});
	});


	logger.info("[WS] Socket.IO server initialized.");
	return io;
}


import { inject, injectable } from "inversify";
import type { MessageSentEvent } from "../../domain/events/message-sent.event";
import type { NotificationCreatedEvent } from "../../domain/events/notification-created.event";
import type { WebSocketServer } from "../../presentation/websocket/socket-server";
import logger from "../../shared/logging/logger";
import { TYPES } from "../../shared/types/types";
import type { InMemoryEventBus } from "./in-memory-event-bus";

/**
 * Bridges domain events to WebSocket emissions.
 * Listens on the InMemoryEventBus and uses WebSocketServer to reach clients.
 */
@injectable()
export class WebSocketEventBridge {
	constructor(
		@inject(TYPES.Services.WebSocketServer)
		private readonly _wsServer: WebSocketServer,
	) {}

	/**
	 * Registers listeners on the in-memory bus.
	 */
	public register(inMemoryBus: InMemoryEventBus): void {
		// Listen for Chat Messages
		inMemoryBus.registerHandler<MessageSentEvent>(
			"chat.message.sent",
			(event) => {
				logger.info(
					`[WS BRIDGE] Bridging chat message for user ${event.receiverId}`,
				);
				this._wsServer.emitToUser(event.receiverId, "chat:message", {
					chatId: event.chatId,
					message: event.message,
				});
			},
		);

		// Listen for New Notifications
		inMemoryBus.registerHandler<NotificationCreatedEvent>(
			"notification.created",
			(event) => {
				logger.info(
					`[WS BRIDGE] Bridging notification for user ${event.userId}`,
				);
				this._wsServer.emitToUser(event.userId, "notification:new", {
					notification: event.notification,
				});
			},
		);

		logger.info("WebSocket Event Bridge registered");
	}
}

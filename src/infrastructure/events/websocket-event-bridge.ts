import { inject, injectable } from "inversify";
import type { AppEvent } from "../../domain/events/app-event";
import type { MessageSentEvent } from "../../domain/events/message-sent.event";
import type { NotificationCreatedEvent } from "../../domain/events/notification-created.event";
import type { WebSocketServer } from "../../presentation/websocket/socket-server";
import logger from "../../shared/logging/logger";
import { TYPES } from "../../shared/types/types";

type WsEventConfig<TEvent> = {
	wsEvent: string;
	resolveTarget: (event: TEvent) => string;
	buildPayload?: (event: TEvent) => unknown;
};

const MESSAGE_SENT_CONFIG: WsEventConfig<MessageSentEvent> = {
	wsEvent: "chat:message",
	resolveTarget: (event) => event.payload.receiverId,
	buildPayload: (event) => ({
		chatId: event.payload.chatId,
		message: event.payload.message,
	}),
};

const NOTIFICATION_CREATED_CONFIG: WsEventConfig<NotificationCreatedEvent> = {
	wsEvent: "notification:new",
	resolveTarget: (event) => event.payload.userId,
	buildPayload: (event) => ({
		notification: event.payload.notification,
	}),
};

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

	public handle(event: AppEvent): void {
		if (event.eventName === "chat.message.sent") {
			const typedEvent = event as MessageSentEvent;
			logger.info("[WS BRIDGE] Bridging chat.message.sent");
			const target = MESSAGE_SENT_CONFIG.resolveTarget(typedEvent);
			const payload = MESSAGE_SENT_CONFIG.buildPayload
				? MESSAGE_SENT_CONFIG.buildPayload(typedEvent)
				: typedEvent.payload;
			this._wsServer.emitToUser(target, MESSAGE_SENT_CONFIG.wsEvent, payload);
			return;
		}

		if (event.eventName === "notification.created") {
			const typedEvent = event as NotificationCreatedEvent;
			logger.info("[WS BRIDGE] Bridging notification.created");
			const target = NOTIFICATION_CREATED_CONFIG.resolveTarget(typedEvent);
			const payload = NOTIFICATION_CREATED_CONFIG.buildPayload
				? NOTIFICATION_CREATED_CONFIG.buildPayload(typedEvent)
				: typedEvent.payload;
			this._wsServer.emitToUser(
				target,
				NOTIFICATION_CREATED_CONFIG.wsEvent,
				payload,
			);
		}
	}
}

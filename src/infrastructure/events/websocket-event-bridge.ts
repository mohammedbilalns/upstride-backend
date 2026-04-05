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

type WsEventMap = {
	"chat.message.sent": WsEventConfig<MessageSentEvent>;
	"notification.created": WsEventConfig<NotificationCreatedEvent>;
};

const WS_EVENT_MAP: WsEventMap = {
	"chat.message.sent": MESSAGE_SENT_CONFIG,
	"notification.created": NOTIFICATION_CREATED_CONFIG,
};

const isWsEventName = (name: string): name is keyof WsEventMap =>
	name in WS_EVENT_MAP;

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
		if (!isWsEventName(event.eventName)) return;

		logger.info(
			{ eventName: event.eventName },
			"[WS BRIDGE] Emitting websocket event",
		);

		const config = WS_EVENT_MAP[event.eventName];

		const typedEvent = event as any;

		const target = config.resolveTarget(typedEvent);
		if (!target) {
			logger.warn({ eventName: event.eventName }, "[WS BRIDGE] Invalid target");
			return;
		}

		const payload = config.buildPayload
			? config.buildPayload(typedEvent)
			: typedEvent.payload;
		this._wsServer.emitToUser(target, config.wsEvent, payload);
	}
}

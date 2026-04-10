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

type WsEventName = keyof WsEventMap;

const WS_EVENT_MAP: WsEventMap = {
	"chat.message.sent": MESSAGE_SENT_CONFIG,
	"notification.created": NOTIFICATION_CREATED_CONFIG,
};

const isWsEventName = (name: string): name is WsEventName =>
	name in WS_EVENT_MAP;

const emitEvent = <TEvent>(
	eventName: WsEventName,
	config: WsEventConfig<TEvent>,
	wsEvent: TEvent,
	wsServer: WebSocketServer,
): void => {
	const target = config.resolveTarget(wsEvent);
	if (!target) {
		logger.warn({ eventName }, "[WS BRIDGE] Invalid target");
		return;
	}

	const payload = config.buildPayload
		? config.buildPayload(wsEvent)
		: (wsEvent as { payload: unknown }).payload;
	wsServer.emitToUser(target, config.wsEvent, payload);
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
		const eventName = event.eventName;
		if (!isWsEventName(eventName)) return;

		logger.info(
			{ eventName: event.eventName },
			"[WS BRIDGE] Emitting websocket event",
		);

		switch (eventName) {
			case "chat.message.sent": {
				const wsEvent = event as MessageSentEvent;
				const config = WS_EVENT_MAP["chat.message.sent"];
				emitEvent(eventName, config, wsEvent, this._wsServer);
				break;
			}
			case "notification.created": {
				const wsEvent = event as NotificationCreatedEvent;
				const config = WS_EVENT_MAP["notification.created"];
				emitEvent(eventName, config, wsEvent, this._wsServer);
				break;
			}
			default:
				break;
		}
	}
}

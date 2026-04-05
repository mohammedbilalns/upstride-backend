import type {
	AppEventPublishOptions,
	IEventBus,
} from "../../application/events/app-event-bus.interface";
import type { EventBus } from "../../application/events/event-bus.interface";
import type { AppEvent } from "../../domain/events/app-event";
import type { WebSocketEventBridge } from "./websocket-event-bridge";

export class AppEventBus implements IEventBus {
	constructor(
		private readonly _durableEventBus: EventBus,
		private readonly _realtimeEventBus: EventBus,
		private _webSocketBridge?: WebSocketEventBridge,
	) {}

	public setWebSocketBridge(bridge: WebSocketEventBridge): void {
		this._webSocketBridge = bridge;
	}

	async publish(
		event: AppEvent,
		options: AppEventPublishOptions,
	): Promise<void> {
		const { durable = false, realtime = false } = options;

		if (!durable && !realtime) {
			throw new Error("IEventBus.publish requires durable or realtime");
		}

		const tasks: Promise<void>[] = [];

		if (durable) {
			tasks.push(this._durableEventBus.publish(event));
		}

		if (realtime) {
			tasks.push(this._realtimeEventBus.publish(event));
		}

		await Promise.all(tasks);

		if (event.meta?.realtime) {
			this._webSocketBridge?.handle(event);
		}
	}
}

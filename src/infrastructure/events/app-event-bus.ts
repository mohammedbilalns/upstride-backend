import type { Worker } from "bullmq";
import type { Redis } from "ioredis";
import type {
	AppEventPublishOptions,
	IEventBus,
} from "../../application/events/app-event-bus.interface";
import type { AppEvent } from "../../domain/events/app-event";
import type { BullMQEventBus } from "./bullmq-event-bus";
import { createAppEventWorker } from "./domain-event.worker";
import type { InMemoryEventBus } from "./in-memory-event-bus";
import type { WebSocketEventBridge } from "./websocket-event-bridge";

export class AppEventBus implements IEventBus {
	constructor(
		private readonly _durableEventBus: BullMQEventBus,
		private readonly _realtimeEventBus: InMemoryEventBus,
		private _webSocketBridge?: WebSocketEventBridge,
	) {}

	public setWebSocketBridge(bridge: WebSocketEventBridge): void {
		this._webSocketBridge = bridge;
	}

	public registerDurableHandler<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void {
		this._durableEventBus.registerHandler(eventName, handler);
	}

	public registerRealtimeHandler<T>(
		eventName: string,
		handler: (event: T) => Promise<void> | void,
	): void {
		this._realtimeEventBus.registerHandler(eventName, handler);
	}

	public createDurableWorker(connection: Redis): Worker {
		return createAppEventWorker(connection, this._durableEventBus);
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

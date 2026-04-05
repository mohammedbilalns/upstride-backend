import type { AppEvent } from "../../domain/events/app-event";

export type AppEventPublishOptions = {
	durable?: boolean;
	realtime?: boolean;
};

export interface IEventBus {
	publish(event: AppEvent, options: AppEventPublishOptions): Promise<void>;
}

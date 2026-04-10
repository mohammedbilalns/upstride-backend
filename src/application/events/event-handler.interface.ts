import type { AppEvent } from "../../domain/events/app-event";

export interface EventHandler<TEvent extends AppEvent> {
	handle(event: TEvent): Promise<void>;
}

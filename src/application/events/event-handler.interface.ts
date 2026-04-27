import type { DomainEvent } from "../../domain/events/domain-event";

export interface EventHandler<TEvent extends DomainEvent> {
	handle(event: TEvent): Promise<void>;
}

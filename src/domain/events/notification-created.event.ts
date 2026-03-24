import type { NotificationDto } from "../../application/modules/notifications/dtos/notification.dto";
import type { AppEvent } from "./domain-event";

export class NotificationCreatedEvent implements AppEvent {
	readonly eventName = "notification.created";
	readonly occurredAt = new Date();

	constructor(
		public readonly userId: string,
		public readonly notification: NotificationDto,
	) {}
}

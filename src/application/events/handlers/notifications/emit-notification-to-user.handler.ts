import { inject, injectable } from "inversify";
import type { NotificationCreatedEvent } from "../../../../domain/events/notification-created.event";
import { TYPES } from "../../../../shared/types/types";
import type { NotificationPort } from "../../../ports/notification.port";
import type { EventHandler } from "../../event-handler.interface";
import { mapNotificationCreatedToRealtime } from "../../mappers/notifications/notification-created.mapper";

@injectable()
export class EmitNotificationToUserHandler
	implements EventHandler<NotificationCreatedEvent>
{
	constructor(
		@inject(TYPES.Services.NotificationPort)
		private readonly _notificationPort: NotificationPort,
	) {}

	async handle(event: NotificationCreatedEvent): Promise<void> {
		const realtimeNotification = mapNotificationCreatedToRealtime(event);
		this._notificationPort.emitToUser(
			realtimeNotification.userId,
			realtimeNotification.channel,
			realtimeNotification.payload,
		);
	}
}

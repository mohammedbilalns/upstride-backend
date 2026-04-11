import { inject, injectable } from "inversify";
import type { MessageSentEvent } from "../../../../domain/events/message-sent.event";
import { TYPES } from "../../../../shared/types/types";
import type { NotificationPort } from "../../../ports/notification.port";
import type { EventHandler } from "../../event-handler.interface";
import { mapMessageSentToRealtime } from "../../mappers/notifications/message-sent.mapper";

@injectable()
export class EmitMessageToUserHandler
	implements EventHandler<MessageSentEvent>
{
	constructor(
		@inject(TYPES.Services.NotificationPort)
		private readonly _notificationPort: NotificationPort,
	) {}

	async handle(event: MessageSentEvent): Promise<void> {
		const realtimeMessage = mapMessageSentToRealtime(event);
		this._notificationPort.emitToUser(
			realtimeMessage.userId,
			realtimeMessage.channel,
			realtimeMessage.payload,
		);
	}
}

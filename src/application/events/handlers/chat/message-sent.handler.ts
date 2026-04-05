import { inject, injectable } from "inversify";
import type { MessageSentEvent } from "../../../../domain/events/message-sent.event";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import type { ICreateNotificationUseCase } from "../../../modules/notifications/use-cases/create-notification.usecase.interface";

@injectable()
export class MessageSentHandler {
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: MessageSentEvent): Promise<void> {
		logger.info(
			`Handling MessageSentEvent for notification creation: ${event.payload.message.id}`,
		);

		try {
			await this._createNotificationUseCase.execute({
				userId: event.payload.receiverId,
				title: "New Message",
				description: `You have received a message from ${event.payload.senderName}`,
				type: "CHAT",
				event: "MESSAGE_RECEIVED",
				actorId: event.payload.message.senderId,
				relatedEntityId: event.payload.message.senderId,
				metadata: {
					chatId: event.payload.chatId,
					messageId: event.payload.message.id,
					senderName: event.payload.senderName,
					receiverName: event.payload.receiverName,
				},
			});
		} catch (error) {
			logger.error(
				`Failed to create notification for MessageSentEvent: ${error}`,
			);
		}
	}
}

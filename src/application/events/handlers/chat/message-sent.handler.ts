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
			`Handling MessageSentEvent for notification creation: ${event.message.id}`,
		);

		try {
			await this._createNotificationUseCase.execute({
				userId: event.receiverId,
				title: "New Message",
				description: `You have received a message from ${event.senderName}`,
				type: "CHAT",
				event: "MESSAGE_RECEIVED",
				actorId: event.message.senderId,
				relatedEntityId: event.message.senderId,
				metadata: {
					chatId: event.chatId,
					messageId: event.message.id,
					senderName: event.senderName,
					receiverName: event.receiverName,
				},
			});
		} catch (error) {
			logger.error(
				`Failed to create notification for MessageSentEvent: ${error}`,
			);
		}
	}
}

import { inject, injectable } from "inversify";
import type { SessionRefundedEvent } from "../../../../domain/events/session-refunded.event";
import { TYPES } from "../../../../shared/types/types";
import type { ICreateNotificationUseCase } from "../../../modules/notifications/use-cases/create-notification.use-case.interface";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class SessionRefundedHandler
	implements EventHandler<SessionRefundedEvent>
{
	constructor(
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async handle(event: SessionRefundedEvent): Promise<void> {
		const { refundAmount, refundPercentage, reason } = event.payload;
		const hasRefund = refundAmount > 0;
		const title = "Session Refund Processed";
		const description = hasRefund
			? `Your refund of ${refundAmount} coins (${refundPercentage}%) has been processed.`
			: reason;

		await this._createNotificationUseCase.execute({
			userId: event.payload.userId,
			type: "SESSION",
			event: "SESSION_REFUNDED",
			title,
			description,
			relatedEntityId: event.payload.bookingId,
			metadata: {
				bookingId: event.payload.bookingId,
				refundAmount,
				refundPercentage,
				reason,
				paymentType: event.payload.paymentType,
				paymentStatus: event.payload.paymentStatus,
			},
		});
	}
}

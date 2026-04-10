import { inject, injectable } from "inversify";
import type { CheckoutCompletedEvent } from "../../../../domain/events/checkout-completed.event";
import { TYPES } from "../../../../shared/types/types";
import type { IConfirmBookingPaymentService } from "../../../modules/payments/services/confirm-booking-payment.service.interface";
import type { IProcessWalletTopupService } from "../../../modules/payments/services/process-wallet-topup.service.interface";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class CheckoutCompletedHandler
	implements EventHandler<CheckoutCompletedEvent>
{
	constructor(
		@inject(TYPES.Services.ConfirmBookingPaymentService)
		private readonly _confirmBookingPaymentService: IConfirmBookingPaymentService,
		@inject(TYPES.Services.ProcessWalletTopupService)
		private readonly _processWalletTopupService: IProcessWalletTopupService,
	) {}

	async handle({ payload: event }: CheckoutCompletedEvent): Promise<void> {
		const {
			userId,
			coins,
			currency,
			amountMinor,
			sessionId,
			provider,
			metadata,
		} = event;

		if (metadata?.type === "BOOKING_PAYMENT" && metadata.bookingId) {
			await this._confirmBookingPaymentService.confirm({
				bookingId: metadata.bookingId,
				sessionId,
				amountMinor,
				currency,
			});
			return;
		}

		await this._processWalletTopupService.process({
			userId,
			coins,
			currency,
			amountMinor,
			sessionId,
			provider,
		});
	}
}

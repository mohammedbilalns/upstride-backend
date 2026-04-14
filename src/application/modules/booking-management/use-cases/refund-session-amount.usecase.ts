import { inject, injectable } from "inversify";
import { SessionRefundedEvent } from "../../../../domain/events/session-refunded.event";
import { COIN_VALUE } from "../../../../shared/constants";
import { TYPES } from "../../../../shared/types/types";
import { DAY_MS } from "../../../../shared/utilities/time.util";
import type { EventBus } from "../../../events/event-bus.interface";
import type { IRefundService } from "../../payments/services/refund.service.interface";
import type {
	RefundSessionAmountInput,
	RefundSessionAmountResponse,
} from "../dtos/booking.dto";
import type { IRefundSessionAmountUseCase } from "./refund-session-amount.usecase.interface";

@injectable()
export class RefundSessionAmountUseCase implements IRefundSessionAmountUseCase {
	constructor(
		@inject(TYPES.Services.RefundService)
		private readonly _refundService: IRefundService,
		@inject(TYPES.Services.EventBus)
		private readonly _eventBus: EventBus,
	) {}

	async execute(
		input: RefundSessionAmountInput,
	): Promise<RefundSessionAmountResponse> {
		//FIX : move strings to constants
		let refundPercentage = 0;
		let reason = "Refund not available within 24 hours of session start.";

		if (input.paymentStatus !== "COMPLETED") {
			refundPercentage = 0;
			reason = "Payment not completed. No refund applicable.";
		} else if (input.cancelledBy === "mentor") {
			refundPercentage = 100;
			reason = "Full refund (cancelled by mentor).";
		} else {
			const startMs = new Date(input.startTime).getTime();
			const diffMs = startMs - Date.now();

			if (!Number.isFinite(diffMs) || diffMs <= 0) {
				refundPercentage = 0;
				reason = "Session already started. No refund applicable.";
			} else if (diffMs <= DAY_MS) {
				refundPercentage = 0;
				reason = "No refund within 24 hours of the session start time.";
			} else if (diffMs <= 3 * DAY_MS) {
				refundPercentage = 50;
				reason = "Refunded 50% (within 3 days of the session).";
			} else {
				refundPercentage = 75;
				reason = "Refunded 75% (more than 3 days before the session).";
			}
		}

		let baseCoins = 0;
		const coinValue = COIN_VALUE;
		if (input.paymentStatus === "COMPLETED") {
			if (input.paymentType === "COINS") {
				baseCoins = input.totalAmount;
			} else {
				if (Number.isFinite(coinValue) && coinValue > 0) {
					baseCoins = input.totalAmount * coinValue;
				}
			}
		}

		const refundAmount = Math.round((baseCoins * refundPercentage) / 100);
		const refundAmountMinor =
			Number.isFinite(coinValue) && coinValue > 0
				? Math.round((refundAmount / coinValue) * 100)
				: 0;

		if (refundAmount > 0) {
			await this._refundService.processRefund({
				bookingId: input.bookingId,
				userId: input.userId,
				refundAmount,
				refundAmountMinor,
				cancelledBy: input.cancelledBy,
				paymentType: input.paymentType,
			});
		}

		await this._eventBus.publish(
			new SessionRefundedEvent({
				bookingId: input.bookingId,
				userId: input.userId,
				refundAmount,
				refundPercentage,
				reason,
				paymentType: input.paymentType,
				paymentStatus: input.paymentStatus,
			}),
		);

		return {
			refund: {
				amount: refundAmount,
				percentage: refundPercentage,
				currency: "COINS",
				reason,
			},
		};
	}
}

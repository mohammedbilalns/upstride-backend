import { inject, injectable } from "inversify";
import type { ISessionBookingRepository } from "../../../../domain/repositories/session-booking.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import { ValidationError } from "../../../shared/errors/validation-error";
import type { IRefundService } from "../../payments/services/refund.service.interface";
import { SlotNotFoundError } from "../../session-slot-management/errors";
import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/session-booking.dto";
import type { ICancelBookingUseCase } from "./cancel-booking.usecase.interface";

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
	constructor(
		@inject(TYPES.Repositories.SessionBookingRepository)
		private readonly _bookingRepository: ISessionBookingRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
		@inject(TYPES.Services.RefundService)
		private readonly _refundService: IRefundService,
	) {}

	async execute({
		userId,
		bookingId,
		reason,
	}: CancelBookingInput): Promise<CancelBookingResponse> {
		const booking = await this._bookingRepository.findById(bookingId);
		if (!booking || booking.userId !== userId) {
			throw new NotFoundError("Booking not found");
		}

		if (booking.status === "cancelled" || booking.status === "refunded") {
			throw new ValidationError("Booking is already cancelled");
		}

		const now = new Date();
		const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
		const refundAmount =
			new Date(booking.startTime).getTime() - now.getTime() >= fiveDaysMs
				? booking.price
				: Math.floor(booking.price * 0.5);

		await this._bookingRepository.updateById(bookingId, {
			status: "cancelled",
			cancellationReason: reason,
			cancelledBy: "user",
			updatedAt: new Date(),
		});

		const slotUpdated = await this._slotRepository.updateById(booking.slotId, {
			status: "available",
			bookingId: null,
		});
		if (!slotUpdated) {
			throw new SlotNotFoundError();
		}

		if (refundAmount > 0) {
			await this._refundService.processRefund({
				bookingId: booking.id,
				userId,
				refundAmount,
				cancelledBy: "user",
			});
		}

		return { bookingId, status: "cancelled" };
	}
}

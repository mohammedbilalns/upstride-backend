import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
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
import type { ICancelBookingByMentorUseCase } from "./cancel-booking-by-mentor.usecase.interface";

@injectable()
export class CancelBookingByMentorUseCase
	implements ICancelBookingByMentorUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
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
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new NotFoundError("Mentor profile not found");
		}

		const booking = await this._bookingRepository.findById(bookingId);
		if (!booking || booking.mentorId !== mentor.id) {
			throw new NotFoundError("Booking not found");
		}

		if (
			booking.status === "cancelled" ||
			booking.status === "refunded" ||
			booking.status === "completed"
		) {
			throw new ValidationError("Booking cannot be cancelled");
		}

		await this._bookingRepository.updateById(bookingId, {
			status: "cancelled",
			cancellationReason: reason,
			cancelledBy: "mentor",
			updatedAt: new Date(),
		});

		const slotUpdated = await this._slotRepository.updateById(booking.slotId, {
			status: "available",
			bookingId: null,
		});
		if (!slotUpdated) {
			throw new SlotNotFoundError();
		}

		const refundAmount = booking.price;

		await this._refundService.processRefund({
			bookingId: booking.id,
			userId: booking.userId,
			refundAmount,
			cancelledBy: "mentor",
		});

		return { bookingId, status: "cancelled" };
	}
}

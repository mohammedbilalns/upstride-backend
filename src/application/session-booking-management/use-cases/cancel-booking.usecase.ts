import { inject, injectable } from "inversify";
import type { ISessionBookingRepository } from "../../../domain/repositories/session-booking.repository.interface";
import type { ISessionSlotRepository } from "../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import { SlotNotFoundError } from "../../session-slot-management/errors";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { ValidationError } from "../../shared/errors/validation-error";
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
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute({
		userId,
		bookingId,
	}: CancelBookingInput): Promise<CancelBookingResponse> {
		const booking = await this._bookingRepository.findById(bookingId);
		if (!booking || booking.userId !== userId) {
			throw new NotFoundError("Booking not found");
		}

		if (booking.status === "cancelled" || booking.status === "refunded") {
			throw new ValidationError("Booking is already cancelled");
		}

		const hours =
			this._platformSettingsService.sessions.cancellationWindowHours;
		const latest = new Date(booking.startTime);
		latest.setHours(latest.getHours() - hours);
		if (new Date() > latest) {
			throw new ValidationError("Cancellation window has passed");
		}

		await this._bookingRepository.updateById(bookingId, {
			status: "cancelled",
			updatedAt: new Date(),
		});

		const slotUpdated = await this._slotRepository.updateById(booking.slotId, {
			status: "available",
			bookingId: null,
		});
		if (!slotUpdated) {
			throw new SlotNotFoundError();
		}

		return { bookingId, status: "cancelled" };
	}
}

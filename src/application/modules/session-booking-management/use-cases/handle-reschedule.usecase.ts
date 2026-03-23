import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../../domain/repositories/mentor.repository.interface";
import type { ISessionBookingRepository } from "../../../../domain/repositories/session-booking.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import { ValidationError } from "../../../shared/errors/validation-error";
import type {
	HandleRescheduleInput,
	HandleRescheduleResponse,
} from "../dtos/session-booking.dto";
import type { IHandleRescheduleUseCase } from "./handle-reschedule.usecase.interface";

@injectable()
export class HandleRescheduleUseCase implements IHandleRescheduleUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
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
		newSlotId,
	}: HandleRescheduleInput): Promise<HandleRescheduleResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new NotFoundError("Mentor profile not found");
		}

		const booking = await this._bookingRepository.findById(bookingId);
		if (!booking || booking.mentorId !== mentor.id) {
			throw new NotFoundError("Booking not found");
		}

		const hours = this._platformSettingsService.sessions.rescheduleWindowHours;
		const latest = new Date(booking.startTime);
		latest.setHours(latest.getHours() - hours);
		if (new Date() > latest) {
			throw new ValidationError("Reschedule window has passed");
		}

		const newSlot = await this._slotRepository.findById(newSlotId);
		if (!newSlot || newSlot.mentorId !== mentor.id) {
			throw new NotFoundError("Slot not found");
		}
		if (newSlot.status !== "available") {
			throw new ValidationError("Slot is not available");
		}

		await this._slotRepository.updateById(booking.slotId, {
			status: "available",
			bookingId: null,
		});
		await this._slotRepository.updateById(newSlot.id, {
			status: "booked",
			bookingId,
		});

		await this._bookingRepository.updateById(bookingId, {
			slotId: newSlot.id,
			startTime: newSlot.startTime,
			endTime: newSlot.endTime,
			price: newSlot.price,
			status: "confirmed",
			updatedAt: new Date(),
		});

		return { bookingId, status: "confirmed" };
	}
}

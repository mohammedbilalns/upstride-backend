import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionBookingRepository } from "../../../../domain/repositories/session-booking.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import { ValidationError } from "../../../shared/errors/validation-error";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import { SlotNotFoundError } from "../../session-slot-management/errors";
import type {
	HandleRescheduleInput,
	HandleRescheduleResponse,
} from "../dtos/session-booking.dto";
import {
	assertRescheduleWindow,
	getBookingForMentorOrThrow,
	updateSlotStatus,
} from "../utils/booking.util";
import type { IHandleRescheduleUseCase } from "./handle-reschedule.usecase.interface";

@injectable()
export class HandleRescheduleUseCase implements IHandleRescheduleUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
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
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorRepository,
			userId,
			"Mentor profile not found",
		);

		const booking = await getBookingForMentorOrThrow(
			this._bookingRepository,
			bookingId,
			mentor.id,
		);

		const hours = this._platformSettingsService.sessions.rescheduleWindowHours;
		assertRescheduleWindow(booking.startTime, hours);

		const newSlot = await this._slotRepository.findById(newSlotId);
		if (!newSlot || newSlot.mentorId !== mentor.id) {
			throw new SlotNotFoundError();
		}
		if (newSlot.status !== "available") {
			throw new ValidationError("Slot is not available");
		}

		await updateSlotStatus(
			this._slotRepository,
			booking.slotId,
			"available",
			null,
		);
		await updateSlotStatus(
			this._slotRepository,
			newSlot.id,
			"booked",
			bookingId,
		);

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

import { inject, injectable } from "inversify";
import { SessionSlot } from "../../../../domain/entities/session-slot.entity";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { SessionSlotLimits } from "../../../../shared/constants/app.constants";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import { ValidationError } from "../../../shared/errors/validation-error";
import type {
	CreateCustomSlotInput,
	CreateCustomSlotResponse,
} from "../dtos/session-slots.dto";
import { MentorPricingNotConfiguredError } from "../errors";
import type { ICreateCustomSlotUseCase } from "./create-custom-slot.usecase.interface";

@injectable()
export class CreateCustomSlotUseCase implements ICreateCustomSlotUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute({
		userId,
		startTime,
		endTime,
		durationMinutes,
	}: CreateCustomSlotInput): Promise<CreateCustomSlotResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new MentorNotFoundError();
		}

		if (!mentor.currentPricePer30Min) {
			throw new MentorPricingNotConfiguredError();
		}

		const start = new Date(startTime);
		const end = new Date(endTime);
		const startMs = start.getTime();
		const endMs = end.getTime();

		if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
			throw new ValidationError("Invalid start or end time");
		}

		if (endMs <= startMs) {
			throw new ValidationError("End time must be after start time");
		}

		if (durationMinutes !== 30 && durationMinutes !== 60) {
			throw new ValidationError("Duration must be 30 or 60 minutes");
		}

		const diffMinutes = Math.round((endMs - startMs) / 60000);
		if (diffMinutes !== durationMinutes) {
			throw new ValidationError("End time must match start time plus duration");
		}

		const nowMs = Date.now();
		if (startMs < nowMs || endMs < nowMs) {
			throw new ValidationError("Cannot create a slot in the past");
		}

		const overlapping = await this._slotRepository.findOverlapping(
			mentor.id,
			start,
			end,
		);
		if (overlapping.length > 0) {
			throw new ValidationError("Slot overlaps with an existing slot");
		}

		const dayStart = new Date(start);
		dayStart.setHours(0, 0, 0, 0);
		const dayEnd = new Date(start);
		dayEnd.setHours(23, 59, 59, 999);
		const slotsForDay = await this._slotRepository.findByMentorIdAndRange(
			mentor.id,
			dayStart,
			dayEnd,
		);
		if (slotsForDay.length >= SessionSlotLimits.MAX_SLOTS_PER_DAY) {
			throw new ValidationError(
				`Maximum of ${SessionSlotLimits.MAX_SLOTS_PER_DAY} slots per day allowed`,
			);
		}

		const price =
			durationMinutes === 30
				? mentor.currentPricePer30Min
				: mentor.currentPricePer30Min * 2;

		const slot = new SessionSlot(
			this._idGenerator.generate(),
			mentor.id,
			start,
			end,
			durationMinutes,
			price,
			"coins",
			"available",
			null,
			null,
		);

		const created = await this._slotRepository.create(slot);
		return { slotId: created.id };
	}
}

import { inject, injectable } from "inversify";
import { SessionSlot } from "../../../domain/entities/session-slot.entity";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { ISessionSlotRepository } from "../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { MentorNotFoundError } from "../../mentor-lists/errors";
import type { IIdGenerator } from "../../services/id-generator.service.interface";
import { ValidationError } from "../../shared/errors/validation-error";
import type {
	CreateCustomSlotInput,
	CreateCustomSlotResponse,
} from "../dtos/session-slots.dto";
import type { ICreateCustomSlotUseCase } from "./create-custom-slot.usecase.interface";

@injectable()
export class CreateCustomSlotUseCase implements ICreateCustomSlotUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
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
			throw new ValidationError("Mentor pricing is not configured");
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

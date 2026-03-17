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

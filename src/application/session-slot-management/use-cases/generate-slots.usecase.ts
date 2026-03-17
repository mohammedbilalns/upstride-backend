import { inject, injectable } from "inversify";
import { SessionSlot } from "../../../domain/entities/session-slot.entity";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { ISessionAvailabilityRepository } from "../../../domain/repositories/session-availability.repository.interface";
import type { ISessionSlotRepository } from "../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { MentorNotFoundError } from "../../mentor-lists/errors";
import type { IIdGenerator } from "../../services/id-generator.service.interface";
import { ValidationError } from "../../shared/errors/validation-error";
import type {
	GenerateSlotsInput,
	GenerateSlotsResponse,
} from "../dtos/session-slots.dto";
import type { IGenerateSlotsUseCase } from "./generate-slots.usecase.interface";

@injectable()
export class GenerateSlotsUseCase implements IGenerateSlotsUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionAvailabilityRepository)
		private readonly _availabilityRepository: ISessionAvailabilityRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute({
		mentorId,
	}: GenerateSlotsInput): Promise<GenerateSlotsResponse> {
		const mentor = await this._mentorRepository.findById(mentorId);
		if (!mentor) {
			throw new MentorNotFoundError();
		}

		if (!mentor.currentPricePer30Min) {
			throw new ValidationError("Mentor pricing is not configured");
		}

		const availability = await this._availabilityRepository.findByOwnerId(
			mentor.id,
		);
		if (!availability) {
			return { createdCount: 0 };
		}

		const start = new Date();
		start.setHours(0, 0, 0, 0);
		const end = new Date(start);
		end.setDate(end.getDate() + 6);
		end.setHours(23, 59, 59, 999);

		const existing = await this._slotRepository.findByMentorIdAndRange(
			mentor.id,
			start,
			end,
		);
		const existingStarts = new Set(
			existing.map((slot) => slot.startTime.toISOString()),
		);

		let createdCount = 0;
		const slotsToCreate: SessionSlot[] = [];

		for (
			let date = new Date(start);
			date <= end;
			date.setDate(date.getDate() + 1)
		) {
			const weekDay = date.getDay();
			const rules = availability.recurringRules.filter(
				(rule) => rule.isActive !== false && rule.weekDay === weekDay,
			);

			for (const rule of rules) {
				for (
					let minutes = rule.startTime;
					minutes + rule.slotDuration <= rule.endTime;
					minutes += rule.slotDuration
				) {
					const slotStart = new Date(date);
					slotStart.setHours(0, 0, 0, 0);
					slotStart.setMinutes(minutes);

					const slotEnd = new Date(slotStart);
					slotEnd.setMinutes(slotEnd.getMinutes() + rule.slotDuration);

					const startKey = slotStart.toISOString();
					if (existingStarts.has(startKey)) {
						continue;
					}

					const price =
						rule.slotDuration === 30
							? mentor.currentPricePer30Min
							: mentor.currentPricePer30Min * 2;

					slotsToCreate.push(
						new SessionSlot(
							this._idGenerator.generate(),
							mentor.id,
							slotStart,
							slotEnd,
							rule.slotDuration,
							price,
							"coins",
							"available",
							null,
							rule.ruleId,
						),
					);
					createdCount += 1;
				}
			}
		}

		for (const slot of slotsToCreate) {
			await this._slotRepository.create(slot);
		}

		return { createdCount };
	}
}

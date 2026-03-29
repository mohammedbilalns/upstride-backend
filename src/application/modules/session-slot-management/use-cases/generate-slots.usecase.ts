import { inject, injectable } from "inversify";
import { SessionSlot } from "../../../../domain/entities/session-slot.entity";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionAvailabilityRepository } from "../../../../domain/repositories/session-availability.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { IST_OFFSET_MINUTES } from "../../../../shared/constants";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type {
	GenerateSlotsInput,
	GenerateSlotsResponse,
} from "../dtos/session-slots.dto";
import { MentorPricingNotConfiguredError } from "../errors";
import type { IGenerateSlotsUseCase } from "./generate-slots.usecase.interface";

//FIX:  has timezone logic hardcoded** but also directly computes slot generation without abstracting the scheduling algorithm. A `ISlotGenerationStrategy` interface would allow different scheduling rules without modifying the use case.
@injectable()
export class GenerateSlotsUseCase implements IGenerateSlotsUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
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
			throw new MentorPricingNotConfiguredError();
		}

		const availability = await this._availabilityRepository.findByOwnerId(
			mentor.id,
		);
		if (!availability) {
			return { createdCount: 0 };
		}

		const now = new Date();
		const nowIst = new Date(now.getTime() + IST_OFFSET_MINUTES * 60000);
		const startIst = new Date(nowIst);
		startIst.setUTCHours(0, 0, 0, 0);
		const start = new Date(startIst.getTime() - IST_OFFSET_MINUTES * 60000);
		const end = new Date(start.getTime() + 6 * 24 * 60 * 60000 + 86399999);

		const existing = await this._slotRepository.findByMentorIdAndRange(
			mentor.id,
			start,
			end,
		);
		const existingSlots = existing.map((slot) => ({
			start: slot.startTime.getTime(),
			end: slot.endTime.getTime(),
		}));

		let createdCount = 0;
		const slotsToCreate: SessionSlot[] = [];

		for (
			let date = new Date(start);
			date <= end;
			date = new Date(date.getTime() + 24 * 60 * 60000)
		) {
			const dateIst = new Date(date.getTime() + IST_OFFSET_MINUTES * 60000);
			const weekDay = dateIst.getUTCDay();
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
					slotStart.setUTCHours(0, 0, 0, 0);
					slotStart.setUTCMinutes(minutes - IST_OFFSET_MINUTES);

					const slotEnd = new Date(slotStart);
					slotEnd.setMinutes(slotEnd.getMinutes() + rule.slotDuration);

					const startMs = slotStart.getTime();
					const endMs = slotEnd.getTime();
					const overlapsExisting = existingSlots.some(
						(existingSlot) =>
							startMs < existingSlot.end && endMs > existingSlot.start,
					);
					const overlapsPending = slotsToCreate.some(
						(existingSlot) =>
							startMs < existingSlot.endTime.getTime() &&
							endMs > existingSlot.startTime.getTime(),
					);

					if (overlapsExisting || overlapsPending) {
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

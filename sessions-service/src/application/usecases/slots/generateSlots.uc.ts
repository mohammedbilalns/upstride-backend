import { IGenerateSlotsUC } from "../../../domain/useCases/slots/generateSlots.uc.interface";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import logger from "../../../common/utils/logger";

export class GenerateSlotsUC implements IGenerateSlotsUC {
	constructor(
		private _availabilityRepository: IAvailabilityRepository,
		private _slotRepository: ISlotRepository,
	) {}

	async execute(mentorId?: string): Promise<void> {
		const availabilities = mentorId
			? [await this._availabilityRepository.findByMentorId(mentorId)]
			: await this._availabilityRepository.findAllActive();

		const today = new Date();
		const bufferDays = 7; // Generate slots for next 7 days

		for (const availability of availabilities) {
			if (!availability) continue;

			for (const rule of availability.recurringRules) {
				console.log(
					`Processing rule: ${rule.ruleId}, WeekDay: ${rule.weekDay}, Active: ${rule.isActive}`,
				);
				if (!rule.isActive) continue;

				for (let i = 0; i < bufferDays; i++) {
					const targetDate = new Date(today);
					targetDate.setDate(today.getDate() + i);
					targetDate.setHours(0, 0, 0, 0);

					const jsDay = targetDate.getDay();
					const isoDay = jsDay === 0 ? 7 : jsDay;

					if (isoDay === rule.weekDay) {
						const startMinutes = rule.startTime;
						const endMinutes = rule.endTime;
						const duration = rule.slotDuration;

						let currentMinutes = startMinutes;
						while (currentMinutes + duration <= endMinutes) {
							const slotStart = new Date(targetDate);
							slotStart.setMinutes(currentMinutes);

							const slotEnd = new Date(targetDate);
							slotEnd.setMinutes(currentMinutes + duration);

							// Prevent generating past slots
							if (slotStart <= new Date()) {
								currentMinutes += duration;
								continue;
							}

							// Idempotency: Check overlap
							const existingSlot =
								await this._slotRepository.findOverlappingSlots(
									availability.mentorId,
									slotStart,
									slotEnd,
								);

							if (!existingSlot) {
								await this._slotRepository.create({
									mentorId: availability.mentorId,
									startAt: slotStart,
									endAt: slotEnd,
									status: SlotStatus.OPEN,
									price: rule.price,
									generatedFrom: availability.id as any,
									ruleId: rule.ruleId,
								});
							}

							currentMinutes += duration;
						}
					}
				}
			}
		}
		logger.info(
			`Slots generated for ${mentorId ? `mentor ${mentorId}` : "all mentors"}`,
		);
	}
}

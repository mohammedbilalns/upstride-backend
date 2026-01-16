import { IGenerateSlotsUC } from "../../../domain/useCases/slots/generate-slots.uc.interface";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IPricingConfigRepository } from "../../../domain/repositories/pricing-config.repository.interface";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import logger from "../../../common/utils/logger";

export class GenerateSlotsUC implements IGenerateSlotsUC {
	constructor(
		private _availabilityRepository: IAvailabilityRepository,
		private _slotRepository: ISlotRepository,
		private _pricingConfigRepository: IPricingConfigRepository,
	) { }

	/**
	 * Generates slots for a mentor based on their recurring availability.
	 * Generates slots for the next 7 days.
	 * Handles pricing configuration and overlap checks.
	 */
	async execute(mentorId?: string): Promise<void> {
		const availabilities = mentorId
			? [await this._availabilityRepository.findByMentorId(mentorId)]
			: await this._availabilityRepository.findAllActive();

		const today = new Date();
		const bufferDays = 7; // Generate slots for next 7 days

		for (const availability of availabilities) {
			if (!availability) continue;

			// Fetch pricing configuration for this mentor
			let pricingConfig = await this._pricingConfigRepository.findByMentor(
				availability.mentorId,
			);

			if (!pricingConfig || !pricingConfig.isActive) {
				logger.info(
					`No active pricing configuration for mentor ${availability.mentorId}, creating default configuration`,
				);

				pricingConfig = await this._pricingConfigRepository.create({
					mentorId: availability.mentorId,
					pricingTiers: [
						{ duration: 30, price: 500 },
						{ duration: 60, price: 1000 },
						{ duration: 90, price: 1500 },
					],
					isActive: true,
				});
			}

			for (const rule of availability.recurringRules) {
				console.log(
					`Processing rule: ${rule.ruleId}, WeekDay: ${rule.weekDay}, Active: ${rule.isActive}`,
				);
				if (!rule.isActive) continue;

				// Find price for this slot duration from pricing config
				const priceTier = pricingConfig.pricingTiers.find(
					(tier) => tier.duration === rule.slotDuration,
				);

				if (!priceTier) {
					logger.warn(
						`No pricing tier found for duration ${rule.slotDuration} minutes for mentor ${availability.mentorId}`,
					);
					continue;
				}

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

							//  Check overlap
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
									price: priceTier.price,
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

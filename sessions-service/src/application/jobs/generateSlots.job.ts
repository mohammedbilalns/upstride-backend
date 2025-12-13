import cron from "node-cron";
import logger from "../../common/utils/logger";
import { AvailabilityRepository } from "../../infrastructure/database/repositories/availability.repository";
import { SlotRepository } from "../../infrastructure/database/repositories/slot.repository";
import { SlotStatus } from "../../domain/entities/slot.entity";

export function scheduleGenerateSlotsJob() {
	// Run every day at midnight
	cron.schedule("0 0 * * *", async () => {
		logger.info("Running generateSlots job");
		try {
			await generateSlots();
			logger.info("generateSlots job completed");
		} catch (error) {
			logger.error("Error running generateSlots job", error);
		}
	});
}

export async function generateSlots() {
	const availabilityRepo = new AvailabilityRepository();
	const slotRepo = new SlotRepository();

	const activeAvailabilities = await availabilityRepo.findAllActive();
	const today = new Date();
	const bufferDays = 7; // Generate slots for the next 7 days

	for (const availability of activeAvailabilities) {
		for (const rule of availability.recurringRules) {
			if (!rule.isActive) continue;

			// Check next 7 days
			for (let i = 0; i < bufferDays; i++) {
				const targetDate = new Date(today);
				targetDate.setDate(today.getDate() + i);
				targetDate.setHours(0, 0, 0, 0);

				// ISO day: 1 (Mon) - 7 (Sun). JS getDay(): 0 (Sun) - 6 (Sat).
				// Convert JS getDay to ISO 1-7.
				const jsDay = targetDate.getDay();
				const isoDay = jsDay === 0 ? 7 : jsDay;

				if (isoDay === rule.weekDay) {
					// Found a matching day. Generate slots for this day.
					const startMinutes = rule.startTime;
					const endMinutes = rule.endTime;
					const duration = rule.slotDuration;

					let currentMinutes = startMinutes;
					while (currentMinutes + duration <= endMinutes) {
						const slotStart = new Date(targetDate);
						slotStart.setMinutes(currentMinutes);

						const slotEnd = new Date(targetDate);
						slotEnd.setMinutes(currentMinutes + duration);

						// Check for overlap
						const existingSlot = await slotRepo.findOverlappingSlots(
							availability.mentorId,
							slotStart,
							slotEnd,
						);

						if (!existingSlot) {
							await slotRepo.create({
								mentorId: availability.mentorId,
								startAt: slotStart,
								endAt: slotEnd,
								status: SlotStatus.OPEN,
								price: availability.price,
								generatedFrom: availability.id as any, // Cast to any or ObjectId if needed
							});
						}

						currentMinutes += duration;
					}
				}
			}
		}
	}
}

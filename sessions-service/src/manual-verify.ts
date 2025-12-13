import {
	connectToDb,
	disconnectFromDb,
} from "./infrastructure/config/connectDb";
import { AvailabilityRepository } from "./infrastructure/database/repositories/availability.repository";
import { SlotRepository } from "./infrastructure/database/repositories/slot.repository";
import { generateSlots } from "./application/jobs/generateSlots.job";
import { removeExpiredSlots } from "./application/jobs/removeExpiredSlots.job";
import { SlotStatus } from "./domain/entities/slot.entity";
import logger from "./common/utils/logger";
import { v4 as uuidv4 } from "uuid";

async function main() {
	try {
		await connectToDb();
		const availabilityRepo = new AvailabilityRepository();
		const slotRepo = new SlotRepository();

		const mentorId = `test - mentor - ${uuidv4()} `;
		// const ruleId = uuidv4();

		logger.info(`Creating test availability for mentor ${mentorId}...`);
		// 1. Create Availability
		const days = [1, 2, 3, 4, 5, 6, 7]; // All days to guarantee a hit
		const availability = await availabilityRepo.create({
			mentorId,
			recurringRules: days.map((day) => ({
				ruleId: uuidv4(),
				weekDay: day,
				startTime: 0, // 00:00
				endTime: 1440, // 24:00
				slotDuration: 60,
				isActive: true,
			})),
			price: 100,
		});
		logger.info("Availability created.");

		// 2. Generate Slots
		logger.info("Running generateSlots...");
		await generateSlots();
		logger.info("generateSlots finished.");

		// 3. Verify Slots
		const slots = await slotRepo.find({ mentorId });
		logger.info(`Found ${slots.length} slots for mentor.`);
		if (slots.length > 0) {
			logger.info("✅ Slots generated successfully.");
		} else {
			logger.error("❌ No slots generated.");
		}

		// 4. Test Remove Expired
		logger.info("Creating expired slot...");
		const expiredSlot = await slotRepo.create({
			mentorId,
			startAt: new Date(Date.now() - 10000000), // Past
			endAt: new Date(Date.now() - 9000000), // Past
			status: SlotStatus.OPEN,
			price: 100,
		});
		logger.info("Expired slot created.");

		logger.info("Running removeExpiredSlots...");
		await removeExpiredSlots();
		logger.info("removeExpiredSlots finished.");

		const checkExpired = await slotRepo.findById(expiredSlot.id);
		if (!checkExpired) {
			logger.info("✅ Expired slot removed successfully.");
		} else {
			logger.error("❌ Expired slot still exists.");
		}

		// Cleanup
		await availabilityRepo.delete(availability.id);
		// Cleanup slots?
		// For now leave them or manual delete if needed.
		// Or delete all slots for this mentor.
		const allSlots = await slotRepo.find({ mentorId });
		for (const slot of allSlots) {
			// delete inheritance not exposed directly via find, but we can assume we might want to clean up.
			// But BaseRepository has delete(id).
			await slotRepo.delete(slot.id);
		}
		logger.info("Cleanup done.");
	} catch (error) {
		logger.error("Error in manual verification:", error);
	} finally {
		await disconnectFromDb();
	}
}

main();

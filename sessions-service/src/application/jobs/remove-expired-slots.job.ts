import cron from "node-cron";
import logger from "../../common/utils/logger";
import { SlotRepository } from "../../infrastructure/database/repositories/slot.repository";

export function scheduleRemoveExpiredSlotsJob() {
	// Run every hour
	cron.schedule("0 * * * *", async () => {
		logger.info("Running removeExpiredSlots job");
		try {
			await removeExpiredSlots();
			logger.info("removeExpiredSlots job completed");
		} catch (error) {
			logger.error("Error running removeExpiredSlots job", error);
		}
	});
}

export async function removeExpiredSlots() {
	const slotRepo = new SlotRepository();
	const deletedCount = await slotRepo.deleteExpiredOpenSlots();
	if (deletedCount > 0) {
		logger.info(`Removed ${deletedCount} expired slots`);
	}
}

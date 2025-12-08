import { scheduleGenerateSlotsJob } from "./generateSlots.job";
import { scheduleRemoveExpiredSlotsJob } from "./removeExpiredSlots.job";

export function initializeJobs() {
	scheduleRemoveExpiredSlotsJob();
	scheduleGenerateSlotsJob();
}

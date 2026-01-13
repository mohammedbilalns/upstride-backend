import { scheduleGenerateSlotsJob } from "./generate-slots.job";
import { scheduleRemoveExpiredSlotsJob } from "./remove-expired-slots.job";

export function initializeJobs() {
	scheduleRemoveExpiredSlotsJob();
	scheduleGenerateSlotsJob();
}

import { scheduleGenerateSlotsJob } from "./generate-slots.job";
import { scheduleRemoveExpiredSlotsJob } from "./remove-expired-slots.job";
import { scheduleSessionReminderJob } from "./session-reminder.job";

export function initializeJobs() {
	scheduleRemoveExpiredSlotsJob();
	scheduleGenerateSlotsJob();
	scheduleSessionReminderJob();
}

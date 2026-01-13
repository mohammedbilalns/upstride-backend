import { scheduleCleanupNotificationsJob } from "./cleanup-notifications.job";

export function initializeJobs() {
	scheduleCleanupNotificationsJob();
}

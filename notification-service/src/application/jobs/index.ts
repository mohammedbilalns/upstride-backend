import { scheduleCleanupNotificationsJob } from "./cleanupNotifications.job";

export function initializeJobs() {
	scheduleCleanupNotificationsJob();
}

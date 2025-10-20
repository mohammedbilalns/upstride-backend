import cron from "node-cron";
import logger from "../../common/utils/logger";
import { NotificationRepository } from "../../infrastructure/database/repositories/notification.repository";

export function scheduleCleanupNotificationsJob() {
	const repository = new NotificationRepository();

	cron.schedule("0 3 * * *", async () => {
		try {
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - 90); // delete notifications older than 90 days
			const deleted = await repository.deleteMany({
				updatedAt: { $lt: cutoffDate },
				isRead: true,
			});

			logger.info(`Cleaned up ${deleted.deletedCount} notifications`);
		} catch (error) {
			logger.error("Error cleaning up notifications", error);
		}
	});
}

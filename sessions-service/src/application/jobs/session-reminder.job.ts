import cron from "node-cron";
import logger from "../../common/utils/logger";
import { SlotRepository } from "../../infrastructure/database/repositories/slot.repository";
import { BookingRepository } from "../../infrastructure/database/repositories/booking.repository";
import eventBus from "../../infrastructure/events/eventBus";
import { QueueEvents } from "../../common/enums/queue-events";
import { SlotStatus } from "../../domain/entities/slot.entity";

// Schedule job to run every hour
export function scheduleSessionReminderJob() {
    cron.schedule("0 * * * *", async () => {
        logger.info("Running SessionReminderJob...");
        try {
            await checkAndSendReminders();
            logger.info("SessionReminderJob completed.");
        } catch (error) {
      logger.error("Error running SessionReminderJob:", error);
    }
  });
}

async function checkAndSendReminders() {
  const slotRepo = new SlotRepository();
  const bookingRepo = new BookingRepository();

  const now = new Date();

  // 24 Hour Window (Start between 24h and 25h from now)
  const start24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const end24 = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  // 1 Hour Window (Start between 1h and 2h from now)
  const start1 = new Date(now.getTime() + 1 * 60 * 60 * 1000);
  const end1 = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  await processRemindersForWindow(slotRepo, bookingRepo, start24, end24, "24h");
  await processRemindersForWindow(slotRepo, bookingRepo, start1, end1, "1h");
}

async function processRemindersForWindow(
  slotRepo: SlotRepository,
  bookingRepo: BookingRepository,
  start: Date,
  end: Date,
  type: string
) {
  // Find bookings  starting in this range
  const slots = await slotRepo.findInTimeRange(start, end, SlotStatus.RESERVED); // Only reserved slots matter

  if (slots.length === 0) return;

  logger.info(`Found ${slots.length} reserved slots for ${type} reminder.`);

  for (const slot of slots) {
    // Find booking for this slot
    const booking = await bookingRepo.findBySlotId(slot.id);

    if (booking && booking.status === "CONFIRMED") {
      // Send Notification
      // To User
      eventBus.publish(QueueEvents.SEND_NOTIFICATION, {
        userId: booking.userId,
        type: "SESSION_REMINDER",
        triggeredBy: slot.mentorId,
        targetResource: slot.id,
        payload: { timeUntil: type }
      });

      // To Mentor
      eventBus.publish(QueueEvents.SEND_NOTIFICATION, {
        userId: slot.mentorId,
        type: "SESSION_REMINDER",
        triggeredBy: "SYSTEM",
        targetResource: slot.id,
        payload: { timeUntil: type }
      });
    }
  }
}

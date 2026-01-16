import { ProcessRefundUC } from "../../../application/useCases/refunds/process-refund.uc";
import { QueueEvents } from "../../../common/enums/queue-events";
import logger from "../../../common/utils/logger";
import { RabbitMQEventBus } from "../../../infrastructure/events/rabbitmq";

export class BookingCancelledSubscriber {
    constructor(private verb: RabbitMQEventBus, private processRefundUC: ProcessRefundUC) { }

    async subscribe() {
        await this.verb.subscribe(QueueEvents.BOOKING_CANCELLED, async (data: any) => {
            logger.info(`Received BOOKING_CANCELLED event for booking ${data.bookingId}`);
            try {
                await this.processRefundUC.execute(
                    data.bookingId,
                    data.userId,
                    data.mentorId,
                    data.refundBreakdown
                );
            } catch (error) {
                logger.error("Error processing refund:", error);
                // Nack logic might be needed here depending on bus implementation
            }
        });
    }
}

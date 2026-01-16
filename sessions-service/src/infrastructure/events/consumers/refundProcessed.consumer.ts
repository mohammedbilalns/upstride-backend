import { QueueEvents } from "../../../common/enums/queue-events";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { BookingStatus } from "../../../domain/entities/booking.entity";
import logger from "../../../common/utils/logger";
import { refundProcessedEventSchema } from "../schemas/event.schemas";

export class RefundProcessedConsumer {
    constructor(private _bookingRepository: IBookingRepository) { }

    async handle(payload: unknown): Promise<void> {
        try {
            // Validate payload
            const event = refundProcessedEventSchema.parse(payload);

            // Update booking status to REFUNDED
            await this._bookingRepository.update(event.bookingId, {
                status: BookingStatus.REFUNDED,
            });

            logger.info(`Booking ${event.bookingId} marked as REFUNDED`);
        } catch (error) {
            logger.error("Error processing refund confirmation:", error);
            throw error;
        }
    }

    get eventName(): string {
        return QueueEvents.REFUND_PROCESSED;
    }
}

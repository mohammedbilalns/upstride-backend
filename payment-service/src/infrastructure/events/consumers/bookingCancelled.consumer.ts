import { QueueEvents } from "../../../common/enums/queue-events";
import { IProcessRefundUC } from "../../../domain/useCases/refunds/process-refund.uc.interface";
import logger from "../../../common/utils/logger";
import { bookingCancelledEventSchema } from "../schemas/event.schemas";

export class BookingCancelledConsumer {
    constructor(private _processRefundUC: IProcessRefundUC) { }

    async handle(payload: unknown): Promise<void> {
        try {
            // Validate payload
            const event = bookingCancelledEventSchema.parse(payload);

            logger.info(
                `Processing refund for cancelled booking: ${event.bookingId}`,
            );

            await this._processRefundUC.execute({
                bookingId: event.bookingId,
                userId: event.userId,
                mentorId: event.mentorId,
                totalAmount: event.totalAmount,
                refundBreakdown: event.refundBreakdown,
            });

            logger.info(`Refund processed for booking: ${event.bookingId}`);
        } catch (error) {
            logger.error(
                `Error processing refund for booking ${(payload as any)?.bookingId}:`,
                error,
            );
            throw error;
        }
    }

    get eventName(): string {
        return QueueEvents.BOOKING_CANCELLED;
    }
}

import { ProcessPayoutUC } from "../../../application/useCases/payouts/process-payout.uc";
import { QueueEvents } from "../../../common/enums/queue-events";
import logger from "../../../common/utils/logger";
import { RabbitMQEventBus } from "../../../infrastructure/events/rabbitmq";

export class SessionCompletedSubscriber {
    constructor(private verb: RabbitMQEventBus, private processPayoutUC: ProcessPayoutUC) { }

    async subscribe() {
        await this.verb.subscribe(QueueEvents.SESSION_COMPLETED, async (data: any) => {
            logger.info(`Received SESSION_COMPLETED event for session ${data.sessionId}`);
            try {
                await this.processPayoutUC.execute(
                    data.sessionId,
                    data.mentorId,
                    data.amount || data.price // Handle both likely fields
                );
            } catch (error) {
                logger.error("Error processing payout:", error);
            }
        });
    }
}

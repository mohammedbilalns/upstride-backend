import { QueueEvents } from "../../../common/enums/queue-events";
import EventBus from "../eventBus";
import { sessionBookedConsumer } from "../consumers/sessionBooked.consumer";

export const composeSessionBookedConsumer = async () => {
	await EventBus.subscribe(QueueEvents.SESSION_BOOKED, (data: any) =>
		sessionBookedConsumer(data, EventBus),
	);
};

import { QueueEvents } from "../../../common/enums/queue-events";
import EventBus from "../eventBus";
import { liveMessageConsumer } from "../consumers/liveMessage.consumer";

export const composeLiveMessageConsumer = async () => {
	await EventBus.subscribe(
		QueueEvents.LIVE_SESSION_MESSAGE,
		liveMessageConsumer,
	);
};

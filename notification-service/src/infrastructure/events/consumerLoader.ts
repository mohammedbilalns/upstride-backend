import logger from "../../common/utils/logger";
import { composeSaveNotificationConsumer } from "./compositions/saveNotification.composition";
import { composeSessionBookedConsumer } from "./compositions/sessionBooked.composition";

export const loadConsumers = async () => {
	await composeSaveNotificationConsumer();
	await composeSessionBookedConsumer();
	logger.info("Event consumers loaded");
};

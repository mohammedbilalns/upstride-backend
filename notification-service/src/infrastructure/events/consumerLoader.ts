import logger from "../../common/utils/logger";
import { composeSaveNotificationConsumer } from "./compositions/saveNotification.composition";

export async function loadConsumers() {
	await composeSaveNotificationConsumer();
	logger.info("Event consumers loaded");
}

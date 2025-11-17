import logger from "../../common/utils/logger";
import { composeMarkMessageReadConsumer } from "./compositions/markMessageRead.composition";
import { composeSendMessageConsumer } from "./compositions/sendMessage.composition";

export async function loadConsumers() {
	await composeSendMessageConsumer();
	await composeMarkMessageReadConsumer();
	logger.info("Event consumers loaded");
}

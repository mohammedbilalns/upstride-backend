import logger from "../../common/utils/logger";
import { composeMarkChatReadConsumer } from "./compositions/markChatRead.composition";
import { composeSendMessageConsumer } from "./compositions/sendMessage.composition";

export async function loadConsumers() {
	await composeSendMessageConsumer();
	await composeMarkChatReadConsumer();
	logger.info("Event consumers loaded");
}

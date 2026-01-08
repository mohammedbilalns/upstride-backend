import logger from "../../common/utils/logger";
import { composeMarkChatReadConsumer } from "./compositions/markChatRead.composition";
import { composeSendMessageConsumer } from "./compositions/sendMessage.composition";
import { composeLiveMessageConsumer } from "./compositions/liveMessage.composition";

export async function loadConsumers() {
	await composeSendMessageConsumer();
	await composeMarkChatReadConsumer();
	await composeLiveMessageConsumer();
	logger.info("Event consumers loaded");
}

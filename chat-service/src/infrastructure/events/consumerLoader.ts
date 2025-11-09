import logger from "../../common/utils/logger";
import { composeSendMessageConsumer } from "./compositions/sendMessage.composition";

export async function loadConsumers() {
  await composeSendMessageConsumer()
	logger.info("Event consumers loaded");
}

import logger from "../../common/utils/logger";
import { composeSaveMediaConsumer } from "./compositions/saveMedia.composition";

export async function loadConsumers() {
	await composeSaveMediaConsumer();
	logger.info("Event consumers loaded");
}

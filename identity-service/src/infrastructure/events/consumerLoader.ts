import logger from "../../common/utils/logger";
import { registerUserConsumer } from "./consumers/sampleConsumer";

export async function loadConsumers() {
  await registerUserConsumer();
  logger.info("Event consumers loaded");
}
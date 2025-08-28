import { loadConsumers } from "./consumerLoader";
import { initEventBus } from "./eventBus";
import logger from "../../common/utils/logger";

export async function connectRabbitMq(){
  await initEventBus()
  await loadConsumers()
  logger.info("RabbitMQ connected and consumers loaded")

}
import { RabbitMQEventBus } from "./rabbitMq";
import env from "../config/env";


const eventBus = new RabbitMQEventBus()

export async function initEventBus(){
  await eventBus.init(env.RABBITMQ_URL)
  return eventBus
}


export default eventBus
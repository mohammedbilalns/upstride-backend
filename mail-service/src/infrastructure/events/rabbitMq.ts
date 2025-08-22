import * as amqp from "amqplib"
import logger from "../../common/utils/logger"
import { IEventBus } from "../../domain/events/IEventBus"
import env from "../config/env"

export class RabbitMQEventBus implements IEventBus {

  private connection!: amqp.Connection
  private channel!: amqp.Channel

  async init(rabbitUrl: string) {
    this.connection = await amqp.connect(rabbitUrl)
    this.channel = await this.connection.createChannel()
    await this.channel.assertExchange(env.EXCHANGE_NAME, "topic", { durable: true })
    logger.info(" Connected to RabbitMQ and exchange ready")
  }

  async publish<T>(routingKey: string, payload: T): Promise<void> {
    if (!this.channel) throw new Error("RabbitMQ not initialized")
    this.channel.publish(
      env.EXCHANGE_NAME,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
    )
    logger.info(`📤 Published event: ${routingKey}`)
  }

  async subscribe<T>(routingKey: string, handler: (payload: T) => Promise<void>): Promise<void> {
    if (!this.channel) throw new Error("RabbitMQ not initialized")

    const q = await this.channel.assertQueue("", { exclusive: true })
    await this.channel.bindQueue(q.queue, env.EXCHANGE_NAME, routingKey)

    this.channel.consume(q.queue, async (msg) => {
      if (msg) {
        const payload = JSON.parse(msg.content.toString()) as T
        await handler(payload)
        this.channel.ack(msg)
        logger.info(`📥 Consumed event: ${routingKey}`)
      }
    })
  }
}

import * as amqp from "amqplib";
import logger from "../../common/utils/logger";
import type { IEventBus } from "../../domain/events/event-bus.interface";
import env from "../config/env";

export class RabbitMQEventBus implements IEventBus {
	private connection!: amqp.Connection;
	private channel!: amqp.Channel;

	/**
	 * Initializes the RabbitMQ connection and prepares the exchange.
	 */
	async init(rabbitUrl: string) {
		// establish tcp connection to rabbitmq
		this.connection = await amqp.connect(rabbitUrl);
		// create channel to send and receive messages
		this.channel = await this.connection.createChannel();
		// Define an exchange using "topic" mode to support routing patterns
		await this.channel.assertExchange(env.EXCHANGE_NAME, "topic", {
			durable: true,
		});
		logger.info(" Connected to RabbitMQ and exchange ready");
	}

	/**
	 * Subscribes to a routing key pattern and executes the given handler
	 * every time a matching event is consumed.
	 *
	 * Creates a temporary exclusive queue automatically bound to the exchange,
	 * allowing multiple services to listen without interfering with each other.
	 */
	async subscribe<T>(
		routingKey: string,
		handler: (payload: T) => Promise<void>,
	): Promise<void> {
		if (!this.channel) throw new Error("RabbitMQ not initialized");

		// Create a private, auto-delete queue for consumer
		const q = await this.channel.assertQueue("", { exclusive: true });
		await this.channel.bindQueue(q.queue, env.EXCHANGE_NAME, routingKey);

		// Consume messages and delegate work to handler
		this.channel.consume(q.queue, async (msg) => {
			if (msg) {
				const payload = JSON.parse(msg.content.toString()) as T;
				await handler(payload);
				this.channel.ack(msg);
				logger.info(`📥 Consumed event: ${routingKey}`);
			}
		});
	}

	/**
	 * Gracefully closes channel and connection.
	 * Prevents resource leaks during service shutdown or worker restart.
	 */
	async disconnect() {
		try {
			if (this.channel) {
				await this.channel.close();
				logger.info("🧹 RabbitMQ channel closed");
			}
			if (this.connection) {
				await this.connection.close();
				logger.info("🧹 RabbitMQ connection closed");
			}
		} catch (err) {
			logger.error("❌ Error during RabbitMQ disconnect:", err);
		}
	}
}

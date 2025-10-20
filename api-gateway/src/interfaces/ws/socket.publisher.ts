import type { Server } from "socket.io";
import type { IEventBus } from "../../domain/events/eventBus.interface";

export class SocketPublisher {
	constructor(
		private io: Server,
		private eventBus: IEventBus,
	) {}

	emitToUser<T>(userId: string, event: string, data: T) {
		this.io.to(userId).emit(event, data);
	}

	async publishToQueue<T>(routingKey: string, payload: T) {
		await this.eventBus.publish(routingKey, payload);
	}

	async emitAndQueue<T>(
		userId: string,
		event: string,
		data: T,
		routingKey?: string,
	) {
		this.emitToUser(userId, event, data);
		if (routingKey) await this.publishToQueue(routingKey, data);
	}
}

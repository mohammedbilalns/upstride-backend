export interface IEventBus {
	publish<T>(routingKey: string, message: T): Promise<void>;
	subscribe<T>(
		routingKey: string,
		handler: (msg: T) => Promise<void>,
	): Promise<void>;
}

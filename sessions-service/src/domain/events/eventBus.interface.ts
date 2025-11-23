export interface IEventBus {
	publish(routingKey: string, message: any): Promise<void>;
	subscribe(
		routingKey: string,
		handler: (msg: any) => Promise<void>,
	): Promise<void>;
}

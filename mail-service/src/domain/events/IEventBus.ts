export interface IEventBus {
	subscribe(
		routingKey: string,
		handler: (msg: any) => Promise<void>,
	): Promise<void>;
}

export interface IEventBus {
    init(connectionUrl: string): Promise<void>;
    publish<T>(routingKey: string, payload: T): Promise<void>;
    subscribe<T>(
        routingKey: string,
        handler: (payload: T) => Promise<void>,
    ): Promise<void>;
    disconnect(): Promise<void>;
}

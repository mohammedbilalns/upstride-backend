export interface UnregisterPushSubscriptionInput {
	userId: string;
	endpoint: string;
}

export interface IUnregisterPushSubscriptionUseCase {
	execute(input: UnregisterPushSubscriptionInput): Promise<void>;
}

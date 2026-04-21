export interface RegisterPushSubscriptionInput {
	userId: string;
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
	deviceType?: string;
}

export interface IRegisterPushSubscriptionUseCase {
	execute(input: RegisterPushSubscriptionInput): Promise<void>;
}

export interface PushSubscriptionKeys {
	p256dh: string;
	auth: string;
}

export interface RawPushSubscription {
	userId: string;
	endpoint: string;
	keys: PushSubscriptionKeys;
	deviceType?: string;
}

export class PushSubscription {
	constructor(
		public readonly userId: string,
		public readonly endpoint: string,
		public readonly keys: PushSubscriptionKeys,
		public readonly deviceType?: string,
	) {}

	static create(data: RawPushSubscription): PushSubscription {
		return new PushSubscription(
			data.userId,
			data.endpoint,
			data.keys,
			data.deviceType,
		);
	}

	toRaw(): RawPushSubscription {
		return {
			userId: this.userId,
			endpoint: this.endpoint,
			keys: this.keys,
			deviceType: this.deviceType,
		};
	}
}

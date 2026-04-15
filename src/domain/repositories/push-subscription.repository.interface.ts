import type { PushSubscription } from "../entities/push-subscription.entity";

export interface IPushSubscriptionRepository {
	save(subscription: PushSubscription): Promise<void>;
	findByUserId(userId: string): Promise<PushSubscription[]>;
	deleteByEndpoint(endpoint: string): Promise<void>;
}

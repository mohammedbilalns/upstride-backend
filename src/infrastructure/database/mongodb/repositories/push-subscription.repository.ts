import { injectable } from "inversify";
import { Types } from "mongoose";
import { PushSubscription } from "../../../../domain/entities/push-subscription.entity";
import type { IPushSubscriptionRepository } from "../../../../domain/repositories/push-subscription.repository.interface";
import { PushSubscriptionModel } from "../models/push-subscription.model";

@injectable()
export class MongoosePushSubscriptionRepository
	implements IPushSubscriptionRepository
{
	async save(subscription: PushSubscription): Promise<void> {
		await PushSubscriptionModel.findOneAndUpdate(
			{ endpoint: subscription.endpoint },
			{
				userId: new Types.ObjectId(subscription.userId),
				keys: subscription.keys,
				deviceType: subscription.deviceType,
			},
			{ upsert: true, new: true },
		);
	}

	async findByUserId(userId: string): Promise<PushSubscription[]> {
		const docs = await PushSubscriptionModel.find({
			userId: new Types.ObjectId(userId),
		});
		return docs.map(
			(doc) =>
				new PushSubscription(
					doc.userId.toString(),
					doc.endpoint,
					doc.keys,
					doc.deviceType,
				),
		);
	}

	async deleteByEndpoint(endpoint: string): Promise<void> {
		await PushSubscriptionModel.deleteOne({ endpoint });
	}
}

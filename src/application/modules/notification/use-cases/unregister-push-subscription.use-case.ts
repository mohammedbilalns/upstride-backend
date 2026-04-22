import { inject, injectable } from "inversify";
import type { IPushSubscriptionRepository } from "../../../../domain/repositories/push-subscription.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	IUnregisterPushSubscriptionUseCase,
	UnregisterPushSubscriptionInput,
} from "./unregister-push-subscription.use-case.interface";

@injectable()
export class UnregisterPushSubscriptionUseCase
	implements IUnregisterPushSubscriptionUseCase
{
	constructor(
		@inject(TYPES.Repositories.PushSubscriptionRepository)
		private readonly _pushSubscriptionRepository: IPushSubscriptionRepository,
	) {}

	async execute(input: UnregisterPushSubscriptionInput): Promise<void> {
		const subscriptions = await this._pushSubscriptionRepository.findByUserId(
			input.userId,
		);
		const subscriptionExistsForUser = subscriptions.some(
			(s) => s.endpoint === input.endpoint,
		);

		if (subscriptionExistsForUser) {
			await this._pushSubscriptionRepository.deleteByEndpoint(input.endpoint);
		}
	}
}

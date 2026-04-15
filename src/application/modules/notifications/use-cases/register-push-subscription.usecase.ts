import { inject, injectable } from "inversify";
import { PushSubscription } from "../../../../domain/entities/push-subscription.entity";
import type { IPushSubscriptionRepository } from "../../../../domain/repositories/push-subscription.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	IRegisterPushSubscriptionUseCase,
	RegisterPushSubscriptionInput,
} from "./register-push-subscription.usecase.interface";

@injectable()
export class RegisterPushSubscriptionUseCase
	implements IRegisterPushSubscriptionUseCase
{
	constructor(
		@inject(TYPES.Repositories.PushSubscriptionRepository)
		private readonly _pushSubscriptionRepository: IPushSubscriptionRepository,
	) {}

	async execute(input: RegisterPushSubscriptionInput): Promise<void> {
		const subscription = PushSubscription.create({
			userId: input.userId,
			endpoint: input.endpoint,
			keys: input.keys,
			deviceType: input.deviceType,
		});

		await this._pushSubscriptionRepository.save(subscription);
	}
}

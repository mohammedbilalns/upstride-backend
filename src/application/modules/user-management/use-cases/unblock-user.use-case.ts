import { inject, injectable } from "inversify";
import { UserStatusChangedEvent } from "../../../../domain/events/user-status-changed.event";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { EventBus } from "../../../events/event-bus.interface";
import { UserNotFoundError } from "../../authentication/errors";
import type { BlockUserInput } from "../dtos/block-user.dto";
import type { IUnblockUserUseCase } from "./unblock-user.use-case.interface";

@injectable()
export class UnblockUserUseCase implements IUnblockUserUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Services.EventBus)
		private _eventBus: EventBus,
	) {}

	async execute(input: BlockUserInput): Promise<void> {
		const user = await this._userRepository.findById(input.userId);
		if (!user) {
			throw new UserNotFoundError();
		}

		await this._userRepository.updateById(input.userId, { isBlocked: false });

		await this._eventBus.publish(
			new UserStatusChangedEvent({ userId: input.userId, isBlocked: false }),
		);
	}
}

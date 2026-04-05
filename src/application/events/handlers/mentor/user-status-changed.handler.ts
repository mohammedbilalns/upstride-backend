import { injectable } from "inversify";
import type { UserStatusChangedEvent } from "../../../../domain/events/user-status-changed.event";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class MentorUserStatusChangedHandler
	implements EventHandler<UserStatusChangedEvent>
{
	constructor(private readonly _mentorRepository: IMentorWriteRepository) {}

	async handle(event: UserStatusChangedEvent): Promise<void> {
		await this._mentorRepository.updateIsUserBlockedStatusByUserId(
			event.payload.userId,
			event.payload.isBlocked,
		);
	}
}

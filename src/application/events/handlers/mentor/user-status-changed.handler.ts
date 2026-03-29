import type { UserStatusChangedEvent } from "../../../../domain/events/user-status-changed.event";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";

export class MentorUserStatusChangedHandler {
	constructor(private readonly _mentorRepository: IMentorWriteRepository) {}

	async handle(event: UserStatusChangedEvent): Promise<void> {
		await this._mentorRepository.updateIsUserBlockedStatusByUserId(
			event.userId,
			event.isBlocked,
		);
	}
}

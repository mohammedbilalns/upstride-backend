import type { ISessionAvailabilityRepository } from "../../../../domain/repositories/session-availability.repository.interface";
import { AvailabilityNotFoundError } from "../errors";

export async function getAvailabilityByMentorIdOrThrow(
	repository: ISessionAvailabilityRepository,
	mentorId: string,
) {
	const availability = await repository.findByOwnerId(mentorId);
	if (!availability) {
		throw new AvailabilityNotFoundError();
	}
	return availability;
}

import type { IMentorWriteRepository } from "../../../domain/repositories/mentor-write.repository.interface";
import { MentorNotFoundError } from "../errors/mentor-not-found.error";

export async function getMentorByUserIdOrThrow(
	repository: IMentorWriteRepository,
	userId: string,
	message?: string,
) {
	const mentor = await repository.findByUserId(userId);
	if (!mentor) {
		if (message) {
			throw new MentorNotFoundError(message);
		}
		throw new MentorNotFoundError();
	}
	return mentor;
}

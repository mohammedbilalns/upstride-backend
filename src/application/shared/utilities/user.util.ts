import type { IUserRepository } from "../../../domain/repositories";
import { UserNotFoundError } from "../errors/user-not-found.error";

export async function getUserByIdOrThrow(
	repository: IUserRepository,
	userId: string,
	message?: string,
) {
	const user = await repository.findById(userId);
	if (!user) {
		if (message) {
			throw new UserNotFoundError(message);
		}
		throw new UserNotFoundError();
	}
	return user;
}

export async function getUserByEmailOrThrow(
	repository: IUserRepository,
	email: string,
	message?: string,
) {
	const user = await repository.findByEmail(email);
	if (!user) {
		if (message) {
			throw new UserNotFoundError(message);
		}
		throw new UserNotFoundError();
	}
	return user;
}

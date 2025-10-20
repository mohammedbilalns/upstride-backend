import { ErrorMessage, HttpStatus } from "../../common/enums";
import type {
	IMentorRepository,
	IUserRepository,
} from "../../domain/repositories";
import type { IConnectionRepository } from "../../domain/repositories/connection.repository.interface";
import type { IConnectionService } from "../../domain/services/connection.service.interface";
import type {
	fetchFollowersResponseDto,
	fetchFollowingResponseDto,
} from "../dtos/connection.dto";
import { AppError } from "../errors/AppError";

export class ConnectionService implements IConnectionService {
	constructor(
		private _connectionRepository: IConnectionRepository,
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
	) {}

	private async validateConnection(
		userId: string,
		mentorId: string,
	): Promise<false | string> {
		const [user, mentor, connection] = await Promise.all([
			this._userRepository.findById(userId),
			this._mentorRepository.findById(mentorId),
			this._connectionRepository.fetchByUserAndMentor(userId, mentorId),
		]);

		if (!user || !mentor)
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
		return connection == null ? false : connection.id;
	}

	async follow(userId: string, mentorId: string): Promise<void> {
		const isExists = await this.validateConnection(userId, mentorId);
		if (isExists)
			throw new AppError(ErrorMessage.ALREADY_FOLLOWED, HttpStatus.BAD_REQUEST);

		await this._connectionRepository.create({ mentorId, followerId: userId });
	}

	async unfollow(userId: string, mentorId: string): Promise<void> {
		const connectionId = await this.validateConnection(userId, mentorId);
		if (connectionId === false)
			throw new AppError(
				ErrorMessage.FORBIDDEN_RESOURCE,
				HttpStatus.BAD_REQUEST,
			);

		await this._connectionRepository.delete(connectionId);
	}

	async fetchFollowers(
		mentorId: string,
		page: number,
		limit: number,
	): Promise<fetchFollowersResponseDto> {
		const { followers, total } =
			await this._connectionRepository.fetchFollowers(mentorId, page, limit);
		return { followers, total };
	}

	async fetchFollowing(
		userId: string,
		page: number,
		limit: number,
	): Promise<fetchFollowingResponseDto> {
		const { following, total } =
			await this._connectionRepository.fetchFollowing(userId, page, limit);
		return { following, total };
	}
}

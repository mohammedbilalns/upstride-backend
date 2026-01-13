import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IMentorRepository } from "../../../domain/repositories";
import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IFetchFollowersUC } from "../../../domain/useCases/connections/fetch-followers.uc.interface";
import type {
	ConnectionsResponseDto,
	FetchFollowersDto,
} from "../../dtos/connection.dto";
import { AppError } from "../../errors/app-error";

export class FetchFollowersUC implements IFetchFollowersUC {
	constructor(
		private _mentorRepository: IMentorRepository,
		private _connectionRepository: IConnectionRepository,
	) {}

	async execute(dto: FetchFollowersDto): Promise<ConnectionsResponseDto> {
		const { userId, page, limit } = dto;
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor)
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
		const followers = await this._connectionRepository.fetchFollowers(
			mentor.id,
			page,
			limit,
		);
		return followers;
	}
}

import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IMentorRepository } from "../../../domain/repositories";
import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IFetchFollowersUC } from "../../../domain/useCases/fetchFollowers.uc.interface";
import { ConnectionsResponseDto } from "../../dtos/connection.dto";
import { AppError } from "../../errors/AppError";

export class FetchFollowersUC implements IFetchFollowersUC {
	constructor(
		private _mentorRepository: IMentorRepository,
		private _connectionRepository: IConnectionRepository,
	) {}

	async execute(
		userId: string,
		page: number,
		limit: number,
	): Promise<ConnectionsResponseDto> {
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

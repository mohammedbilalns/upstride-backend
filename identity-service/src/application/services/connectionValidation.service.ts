import { ErrorMessage, HttpStatus } from "../../common/enums";
import { IMentorRepository, IUserRepository } from "../../domain/repositories";
import { IConnectionRepository } from "../../domain/repositories/connection.repository.interface";
import { IConnectionValidationService } from "../../domain/services/connectionValidation.service.interface";
import { AppError } from "../errors/AppError";

import { ValidateConnectionDto } from "../../application/dtos/connection.dto";

export class ConnectionValidationService
	implements IConnectionValidationService
{
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
		private _connectionRepository: IConnectionRepository,
	) {}

	public async validate(dto: ValidateConnectionDto): Promise<false | string> {
		const { userId, mentorId } = dto;
		const [user, mentor, connection] = await Promise.all([
			this._userRepository.findById(userId),
			this._mentorRepository.findById(mentorId),
			this._connectionRepository.fetchByUserAndMentor(userId, mentorId),
		]);

		if (!user || !mentor)
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
		return connection == null ? false : connection.id;
	}
}

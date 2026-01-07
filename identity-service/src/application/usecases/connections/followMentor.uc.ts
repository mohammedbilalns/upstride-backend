import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IConnectionValidationService } from "../../../domain/services/connectionValidation.service.interface";
import { IFollowMentorUC } from "../../../domain/useCases/connections/followMentor.uc.interface";
import type { FollowMentorDto } from "../../dtos/connection.dto";
import { AppError } from "../../errors/AppError";

export class FollowMentorUC implements IFollowMentorUC {
	constructor(
		private _connectionRepository: IConnectionRepository,
		private _connectionValidationService: IConnectionValidationService,
	) {}

	async execute(dto: FollowMentorDto): Promise<void> {
		const { userId, mentorId } = dto;
		const isExists = await this._connectionValidationService.validate({
			userId,
			mentorId,
		});
		if (isExists)
			throw new AppError(ErrorMessage.ALREADY_FOLLOWED, HttpStatus.BAD_REQUEST);

		await this._connectionRepository.create({ mentorId, followerId: userId });
	}
}

import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IConnectionValidationService } from "../../../domain/services/connection-validation.service.interface";
import { IUnfollowMentorUC } from "../../../domain/useCases/connections/unfollow-mentor.uc.interface";
import { AppError } from "../../errors/app-error";

export class UnfollowMentorUC implements IUnfollowMentorUC {
	constructor(
		private _connectionRepository: IConnectionRepository,
		private _connectionValidationService: IConnectionValidationService,
	) {}

	async execute(userId: string, mentorId: string): Promise<void> {
		const connectionId = await this._connectionValidationService.validate({
			userId,
			mentorId,
		});
		if (connectionId === false)
			throw new AppError(
				ErrorMessage.FORBIDDEN_RESOURCE,
				HttpStatus.BAD_REQUEST,
			);

		await this._connectionRepository.delete(connectionId);
	}
}

import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { Mentor } from "../../../domain/entities";
import { IMentorRepository } from "../../../domain/repositories";
import { IFetchSelfUC } from "../../../domain/useCases/mentorManagement/fetch-self.uc.interface";
import { AppError } from "../../errors/app-error";

export class FetchSelfUC implements IFetchSelfUC {
	constructor(private _mentorRepository: IMentorRepository) {}

	async execute(userId: string): Promise<Mentor> {
		const mentor = await this._mentorRepository.findByUserId(
			userId,
			true,
			true,
		);
		if (!mentor)
			throw new AppError(ErrorMessage.INVALID_USERID, HttpStatus.BAD_REQUEST);
		return mentor;
	}
}

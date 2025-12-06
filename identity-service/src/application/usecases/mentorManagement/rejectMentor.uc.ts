import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { IRejectMentorUC } from "../../../domain/useCases/mentorManagement/rejectMentor.uc.interface";
import { rejectMentorDto } from "../../dtos";
import { AppError } from "../../errors/AppError";

export class RejectMentorUC implements IRejectMentorUC {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
	) {}

	async execute(dto: rejectMentorDto): Promise<void> {
		const mentor = await this._mentorRepository.findById(dto.mentorId);
		if (!mentor)
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);

		await Promise.all([
			this._userRepository.update(mentor.userId, {
				isRequestedForMentoring: "rejected",
			}),
			this._mentorRepository.update(mentor.id, {
				isActive: false,
				isRejected: true,
				isPending: false,
				rejectionReason: dto.rejectionReason,
			}),
		]);
	}
}

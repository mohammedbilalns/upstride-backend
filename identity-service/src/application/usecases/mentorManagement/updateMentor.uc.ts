import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { IUpdateMentorUC } from "../../../domain/useCases/mentorManagement/updateMentor.uc.interface";
import { updateMentoDto } from "../../dtos";
import { AppError } from "../../errors/AppError";

export class UpdateMentorUC implements IUpdateMentorUC {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
	) {}

	async execute(dto: updateMentoDto): Promise<void> {
		const {
			userId,
			bio,
			currentRole,
			organisation,
			educationalQualifications,
			personalWebsite,
			skills,
		} = dto;

		const user = await this._userRepository.findById(userId);
		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		const mentorDetails = {
			bio,
			currentRole,
			organisation,
			educationalQualifications,
			personalWebsite,
			userId,
			skillIds: skills,
		};
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		await Promise.all([
			this._mentorRepository.update(mentor.id, {
				...mentorDetails,
				isPending: true,
			}),
			this._userRepository.update(userId, {
				isRequestedForMentoring: "pending",
				mentorRegistrationCount: (user.mentorRegistrationCount || 0) + 1,
			}),
		]);
	}
}

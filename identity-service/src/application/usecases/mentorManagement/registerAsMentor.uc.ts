import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { IRegisterAsMentorUC } from "../../../domain/useCases/mentorManagement/registerAsMentor.uc.interface";
import { MentorRegistrationDTO } from "../../dtos";
import { AppError } from "../../errors/AppError";

export class RegisterAsMentorUC implements IRegisterAsMentorUC {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
	) {}

	async execute(dto: MentorRegistrationDTO): Promise<void> {
		const {
			userId,
			bio,
			currentRole,
			organisation,
			yearsOfExperience,
			educationalQualifications,
			personalWebsite,
			resume,
			termsAccepted,
			skills,
			expertise,
		} = dto;

		const user = await this._userRepository.findById(userId);
		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (user.mentorRegistrationCount && user.mentorRegistrationCount >= 3)
			throw new AppError(
				ErrorMessage.MENTOR_LIMIT_REACHED,
				HttpStatus.BAD_REQUEST,
			);

		if (user.isRequestedForMentoring === "approved") {
			throw new AppError(
				ErrorMessage.MENTOR_ALREADY_APPROVED,
				HttpStatus.BAD_REQUEST,
			);
		}
		const mentorDetails = {
			bio,
			currentRole,
			organisation,
			yearsOfExperience,
			educationalQualifications,
			personalWebsite,
			resumeId: resume.public_id,
			expertiseId: expertise,
			userId,
			termsAccepted,
			skillIds: skills,
			expertise,
		};
		await Promise.all([
			this._mentorRepository.create({ ...mentorDetails, isPending: true }),
			this._userRepository.update(userId, {
				isRequestedForMentoring: "pending",
				mentorRegistrationCount: (user.mentorRegistrationCount || 0) + 1,
			}),
		]);
	}
}

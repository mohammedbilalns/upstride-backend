import { MAX_REGISTRATION_COUNT } from "../../../common/constants/mentorRegistrationOptions";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { IExpertiseHelperService } from "../../../domain/services/expertise-helper.service.interface";
import { IRegisterAsMentorUC } from "../../../domain/useCases/mentorManagement/register-as-mentor.uc.interface";
import { MentorRegistrationDTO } from "../../dtos";
import { AppError } from "../../errors/app-error";

export class RegisterAsMentorUC implements IRegisterAsMentorUC {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
		private _expertiseHelperService: IExpertiseHelperService,
	) {}

	async execute(dto: MentorRegistrationDTO): Promise<void> {
		const user = await this._userRepository.findById(dto.userId);
		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (
			user.mentorRegistrationCount &&
			user.mentorRegistrationCount >= MAX_REGISTRATION_COUNT
		)
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
		const newSkillsIds: string[] =
			await this._expertiseHelperService.processNewSkills(
				dto.newSkills ? dto.newSkills : [],
				dto.expertise,
			);

		const mentorDetails = {
			bio: dto.bio,
			currentRole: dto.currentRole,
			organisation: dto.organisation,
			yearsOfExperience: dto.yearsOfExperience,
			educationalQualifications: dto.educationalQualifications,
			personalWebsite: dto.personalWebsite,
			resumeId: dto.resume.public_id,
			expertiseId: dto.expertise,
			userId: dto.userId,
			termsAccepted: dto.termsAccepted,
			skillIds: [...dto.skills, ...newSkillsIds],
			expertise: dto.expertise,
		};

		await Promise.all([
			this._mentorRepository.create({ ...mentorDetails, isPending: true }),
			this._userRepository.update(dto.userId, {
				isRequestedForMentoring: "pending",
				mentorRegistrationCount: (user.mentorRegistrationCount || 0) + 1,
			}),
		]);
	}
}
